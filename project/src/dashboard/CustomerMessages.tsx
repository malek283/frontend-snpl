import React, { useState } from 'react';
import { MessageSquare, Search, Star } from 'lucide-react';
import { CustomerMessage, mockCustomerMessages } from './data/mockData';

const CustomerMessages: React.FC = () => {
  const [messages, setMessages] = useState<CustomerMessage[]>(mockCustomerMessages);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter(msg =>
    msg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.orderId.toString().includes(searchQuery)
  );

  const customerMessages = selectedCustomer
    ? messages.filter(msg => msg.customerId === selectedCustomer)
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer) return;

    const newMsg: CustomerMessage = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      customerName: customerMessages[0].customerName,
      orderId: customerMessages[0].orderId,
      content: newMessage,
      date: new Date().toISOString(),
      isFromMerchant: true,
      hasEarlyPaymentReward: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleOfferReward = (customerId: string) => {
    const rewardMessage: CustomerMessage = {
      id: Date.now().toString(),
      customerId,
      customerName: customerMessages[0].customerName,
      orderId: customerMessages[0].orderId,
      content: "Pour vous remercier de votre paiement rapide, nous vous offrons une remise de 10% sur votre prochaine commande ! Code promo : EARLY10",
      date: new Date().toISOString(),
      isFromMerchant: true,
      hasEarlyPaymentReward: true,
    };

    setMessages([...messages, rewardMessage]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Messages Clients</h1>
        <p className="text-gray-500">Gérez vos conversations avec les clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedCustomer(msg.customerId)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedCustomer === msg.customerId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{msg.customerName}</p>
                    <p className="text-sm text-gray-500">Commande #{msg.orderId}</p>
                  </div>
                  {msg.hasEarlyPaymentReward && (
                    <Star className="text-yellow-400" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col h-[600px]">
          {selectedCustomer ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {customerMessages[0]?.customerName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Commande #{customerMessages[0]?.orderId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOfferReward(selectedCustomer)}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                  >
                    Offrir une remise
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {customerMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isFromMerchant ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        msg.isFromMerchant
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } ${msg.hasEarlyPaymentReward ? 'border-2 border-yellow-400' : ''}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isFromMerchant ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {new Date(msg.date).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <p>Sélectionnez un client pour voir la conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMessages;