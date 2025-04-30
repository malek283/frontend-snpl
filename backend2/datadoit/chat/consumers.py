from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from .models import ChatRoom, ChatMessage, Notification, PinnedMessage, MessageReaction, MessageRead, Shop
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if not user.is_authenticated:
            logger.warning(f"Unauthenticated user attempted to connect: {self.scope.get('path')}")
            await self.close(code=4001, reason="Authentication required")
            return

        try:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'
            self.room = await self.get_room(self.room_name)
        except KeyError as e:
            logger.error(f"Missing room_name in URL route: {e}")
            await self.close(code=4004, reason="Invalid room name")
            return

        # Validate user access based on role and room type
        if not await self.validate_access(user, self.room):
            logger.warning(f"User {user.email} unauthorized for room {self.room_name}")
            await self.close(code=4003, reason="Unauthorized access")
            return

        await self.add_user_to_room(user)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        logger.info(f"User {user.email} connected to room {self.room_name}")

        # Notify Marchant of customer entry (for shop rooms)
        if self.room.room_type == 'shop' and user.role == 'Client':
            await self.notify_customer_entered(user)

        # Send initial data
        await self.notify_member_status(True)
        await self.send_previous_messages()
        await self.send_members()
        await self.send_notifications()

    async def disconnect(self, close_code):
        if hasattr(self.scope, 'user') and self.scope['user'].is_authenticated:
            await self.notify_member_status(False)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            logger.info(f"Received message type: {message_type}")

            if message_type == 'get_members' or message_type == 'get_customers':
                await self.send_members()
            elif message_type == 'chat_message':
                message = text_data_json.get('message')
                customer_id = text_data_json.get('customer_id')
                reply_to = text_data_json.get('reply_to')
                if not message:
                    logger.warning("Received empty message")
                    return
                user = self.scope['user']
                message_id = await self.save_message(self.room, user, message, customer_id, reply_to)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'id': str(message_id),
                        'message': message,
                        'sender_name': user.name,
                        'sender_id': str(user.id),
                        'customer_id': customer_id,
                        'reply_to': reply_to,
                        'time': self.get_current_time().isoformat()
                    }
                )
                await self.save_and_send_notification(message, user.name, message_id)
            elif message_type == 'edit_message':
                message_id = text_data_json.get('message_id')
                new_text = text_data_json.get('new_text')
                if message_id and new_text:
                    await self.edit_message(message_id, new_text)
                    await self.notify_message_edited(message_id, new_text)
            elif message_type == 'delete_message':
                message_id = text_data_json.get('message_id')
                if message_id:
                    await self.delete_message(message_id)
                    await self.notify_message_deleted(message_id)
            elif message_type == 'pin_message':
                message_id = text_data_json.get('message_id')
                if message_id:
                    await self.pin_message(message_id)
                    await self.notify_message_pinned(message_id)
            elif message_type == 'react_to_message':
                message_id = text_data_json.get('message_id')
                emoji = text_data_json.get('emoji')
                if message_id and emoji:
                    await self.react_to_message(message_id, emoji)
                    await self.notify_message_reaction(message_id, emoji)
            elif message_type == 'mark_as_read':
                message_id = text_data_json.get('message_id')
                if message_id:
                    db_message_id = await self.mark_message_as_read(message_id)
                    if db_message_id:
                        await self.notify_message_read(db_message_id)
            elif message_type == 'get_notifications':
                await self.send_notifications()
            elif message_type == 'mark_notification_as_read':
                notification_id = text_data_json.get('notification_id')
                if notification_id:
                    await self.mark_notification_as_read(notification_id)
                    await self.notify_notification_read(notification_id)
            elif message_type == 'mark_all_notifications_as_read':
                await self.mark_all_notifications_as_read()
                await self.notify_all_notifications_read()
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON data received: {e}")
        except Exception as e:
            logger.error(f"Error in receive: {e}")

    # WebSocket Message Handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'id': event['id'],
            'message': event['message'],
            'sender_name': event['sender_name'],
            'sender_id': event['sender_id'],
            'customer_id': event.get('customer_id'),
            'reply_to': event.get('reply_to'),
            'time': event['time']
        }))

    async def customer_entered(self, event):
        await self.send(text_data=json.dumps({
            'type': 'customer_entered',
            'customer_id': event['customer_id'],
            'customer_name': event['customer_name']
        }))

    async def member_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'member_status',
            'user_id': event['user_id'],
            'name': event['name'],
            'isOnline': event['isOnline']
        }))

    async def message_edited(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_edited',
            'message_id': event['message_id'],
            'new_text': event['new_text']
        }))

    async def message_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'message_id': event['message_id']
        }))

    async def message_pinned(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_pinned',
            'message_id': event['message_id']
        }))

    async def message_reaction(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_reaction',
            'message_id': event['message_id'],
            'emoji': event['emoji'],
            'sender_name': event['sender_name']
        }))

    async def message_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_read',
            'message_id': event['message_id']
        }))

    async def notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification_id': event['notification_id'],
            'message': event['message'],
            'sender_name': event['sender_name'],
            'time': event['time'],
            'read': event['read']
        }))

    async def notification_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification_read',
            'notification_id': event['notification_id']
        }))

    async def all_notifications_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_notifications_read'
        }))

    # Database Operations
    @database_sync_to_async
    def get_room(self, room_name):
        try:
            return ChatRoom.objects.get(name=room_name)
        except ChatRoom.DoesNotExist:
            room_type = 'admin' if room_name.startswith('admin_') else 'shop'
            shop = None
            if room_type == 'shop':
                shop = Shop.objects.get(id=room_name)
            return ChatRoom.objects.create(name=room_name, room_type=room_type, shop=shop)

    @database_sync_to_async
    def validate_access(self, user, room):
        if room.room_type == 'admin' and user.role != 'admin':
            return False
        if room.room_type == 'shop':
            if user.role == 'Marchant' and room.shop.Marchant != user:
                return False
            if user.role not in ['Marchant', 'customer']:
                return False
        return True

    @database_sync_to_async
    def add_user_to_room(self, user):
        room = ChatRoom.objects.get(name=self.room_name)
        if user not in room.members.all():
            room.members.add(user)

    @database_sync_to_async
    def save_message(self, room, user, message, customer_id, reply_to):
        customer = User.objects.get(id=customer_id) if customer_id else user
        msg = ChatMessage.objects.create(
            room=room,
            user=user,
            customer=customer,
            message=message,
            reply_to_id=reply_to
        )
        return msg.id

    @database_sync_to_async
    def get_room_members(self, room):
        if room.room_type == 'shop':
            return list(room.members.filter(role='Client').values('id', 'name', 'role', 'is_online'))
        return list(room.members.filter(role='Admin').values('id', 'name', 'role', 'is_online'))

    @database_sync_to_async
    def get_previous_messages(self, room):
        return list(ChatMessage.objects.filter(room=room).order_by('timestamp').values(
            'id', 'user__name', 'user__id', 'customer__id', 'message', 'timestamp',
            'is_edited', 'is_deleted', 'reply_to_id'
        ))

    @database_sync_to_async
    def get_previous_notifications(self, user):
        return list(Notification.objects.filter(user=user).values(
            'id', 'message', 'sender', 'timestamp', 'read'
        ))

    @database_sync_to_async
    def edit_message(self, message_id, new_text):
        message = ChatMessage.objects.get(id=message_id, user=self.scope['user'])
        message.message = new_text
        message.is_edited = True
        message.save()

    @database_sync_to_async
    def delete_message(self, message_id):
        message = ChatMessage.objects.get(id=message_id, user=self.scope['user'])
        message.is_deleted = True
        message.save()

    @database_sync_to_async
    def pin_message(self, message_id):
        message = ChatMessage.objects.get(id=message_id)
        PinnedMessage.objects.create(message=message, pinned_by=self.scope['user'])

    @database_sync_to_async
    def react_to_message(self, message_id, emoji):
        message = ChatMessage.objects.get(id=message_id)
        MessageReaction.objects.get_or_create(
            message=message, user=self.scope['user'], emoji=emoji
        )

    @database_sync_to_async
    def mark_message_as_read(self, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            MessageRead.objects.get_or_create(message=message, user=self.scope['user'])
            return message.id
        except ChatMessage.DoesNotExist:
            logger.warning(f"Message with ID {message_id} does not exist")
            return None

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=self.scope['user'])
            notification.read = True
            notification.save()
        except Notification.DoesNotExist:
            logger.warning(f"Notification with ID {notification_id} does not exist")

    @database_sync_to_async
    def mark_all_notifications_as_read(self):
        Notification.objects.filter(user=self.scope['user']).update(read=True)

    # Notification Methods
    async def notify_customer_entered(self, user):
        Marchant = await database_sync_to_async(lambda: self.room.shop.Marchant)()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'customer_entered',
                'customer_id': str(user.id),
                'customer_name': user.name
            }
        )
        notification = await database_sync_to_async(Notification.objects.create)(
            user=Marchant,
            message=f"{user.name} has entered your shop",
            sender=user.name,
            read=False
        )
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'notification',
                'notification_id': str(notification.id),
                'message': notification.message,
                'sender_name': notification.sender,
                'time': notification.timestamp.isoformat(),
                'read': notification.read
            }
        )

    async def save_and_send_notification(self, message, sender_name, message_id):
        members = await self.get_room_members(self.room)
        for member in members:
            if member['name'] != sender_name:
                user = await database_sync_to_async(User.objects.get)(id=member['id'])
                notification = await database_sync_to_async(Notification.objects.create)(
                    user=user,
                    message=f"New message from {sender_name}: {message[:50]}...",
                    sender=sender_name,
                    read=False
                )
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'notification',
                        'notification_id': str(notification.id),
                        'message': notification.message,
                        'sender_name': notification.sender,
                        'time': notification.timestamp.isoformat(),
                        'read': notification.read
                    }
                )

    async def send_previous_messages(self):
        messages = await self.get_previous_messages(self.room)
        for msg in messages:
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'id': str(msg['id']),
                'message': msg['message'],
                'sender_name': msg['user__name'],
                'sender_id': str(msg['user__id']),
                'customer_id': str(msg['customer__id']),
                'reply_to': msg.get('reply_to_id'),
                'time': msg['timestamp'].isoformat(),
                'is_edited': msg.get('is_edited', False),
                'is_deleted': msg.get('is_deleted', False)
            }))

    async def send_members(self):
        members = await self.get_room_members(self.room)
        await self.send(text_data=json.dumps({
            'type': 'customers' if self.room.room_type == 'shop' else 'members',
            'customers' if self.room.room_type == 'shop' else 'members': [
                {
                    'id': str(member['id']),
                    'name': member['name'],
                    'is_online': member['is_online']
                }
                for member in members
            ]
        }))

    async def send_notifications(self):
        notifications = await self.get_previous_notifications(self.scope['user'])
        for notification in notifications:
            await self.send(text_data=json.dumps({
                'type': 'notification',
                'notification_id': str(notification['id']),
                'message': notification['message'],
                'sender_name': notification['sender'],
                'time': notification['timestamp'].isoformat(),
                'read': notification['read']
            }))

    async def notify_member_status(self, is_online):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'member_status',
                'user_id': str(self.scope['user'].id),
                'name': self.scope['user'].name,
                'isOnline': is_online
            }
        )

    async def notify_message_edited(self, message_id, new_text):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_edited',
                'message_id': str(message_id),
                'new_text': new_text
            }
        )

    async def notify_message_deleted(self, message_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_deleted',
                'message_id': str(message_id)
            }
        )

    async def notify_message_pinned(self, message_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_pinned',
                'message_id': str(message_id)
            }
        )

    async def notify_message_reaction(self, message_id, emoji):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_reaction',
                'message_id': str(message_id),
                'emoji': emoji,
                'sender_name': self.scope['user'].name
            }
        )

    async def notify_message_read(self, message_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_read',
                'message_id': str(message_id)
            }
        )

    async def notify_notification_read(self, notification_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'notification_read',
                'notification_id': str(notification_id)
            }
        )

    async def notify_all_notifications_read(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'all_notifications_read'
            }
        )

    def get_current_time(self):
        return datetime.now()