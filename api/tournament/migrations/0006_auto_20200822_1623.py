# Generated by Django 3.0.8 on 2020-08-22 23:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0005_auto_20200822_0407'),
    ]

    operations = [
        migrations.RenameField(
            model_name='game',
            old_name='game_size',
            new_name='battle_size',
        ),
    ]
