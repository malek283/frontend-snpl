# Generated by Django 5.2 on 2025-05-06 22:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='nombre_clients_parraines',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='client',
            name='referral_code',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]
