# Generated by Django 5.2.1 on 2025-06-08 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0004_sucursal_email_sucursal_imagen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sucursal',
            name='imagen',
            field=models.ImageField(blank=True, help_text='Imagen de la sucursal (opcional)', null=True, upload_to='sucursales/'),
        ),
    ]
