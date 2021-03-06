# Generated by Django 3.0.8 on 2020-08-22 10:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0002_auto_20200822_0335'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='entries',
            field=models.ManyToManyField(to='tournament.TournamentEntry'),
        ),
        migrations.AlterField(
            model_name='game',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='winners', to='tournament.TournamentEntry'),
        ),
    ]
