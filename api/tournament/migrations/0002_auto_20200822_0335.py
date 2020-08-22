# Generated by Django 3.0.8 on 2020-08-22 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='round',
            name='entries',
        ),
        migrations.AddField(
            model_name='battle',
            name='battle_index',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='game',
            name='game_size',
            field=models.IntegerField(choices=[(2, 'TWO'), (3, 'THREE'), (4, 'FOUR')], default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='game',
            name='bracket_size',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='game',
            name='curr_round',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='round',
            name='round_num',
            field=models.IntegerField(),
        ),
    ]