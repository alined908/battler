# Generated by Django 3.0.8 on 2020-08-19 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0010_auto_20200818_1343'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='is_gameend',
            field=models.BooleanField(default=False),
        ),
    ]