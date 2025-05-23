# Generated by Django 5.2 on 2025-05-04 21:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('boutique', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Configurer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parametre', models.TextField(verbose_name='Paramètre')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Mis à jour le')),
                ('boutique', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configurations', to='boutique.boutique', verbose_name='Boutique')),
            ],
            options={
                'verbose_name': 'Configuration',
                'verbose_name_plural': 'Configurations',
                'db_table': 'configurations',
            },
        ),
    ]
