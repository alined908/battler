# Generated by Django 3.0.8 on 2020-08-16 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0004_game_session'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='password',
            field=models.CharField(blank=True, default=None, max_length=32, null=True),
        ),
    ]
