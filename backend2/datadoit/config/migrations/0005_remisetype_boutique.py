# Generated by Django 5.2 on 2025-05-06 13:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boutique', '0001_initial'),
        ('config', '0004_remove_remisetype_boutique_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='remisetype',
            name='boutique',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='remise_types', to='boutique.boutique', verbose_name='Boutique'),
        ),
    ]
