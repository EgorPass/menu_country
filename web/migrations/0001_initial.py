# Generated by Django 4.1.2 on 2022-10-18 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.TextField(verbose_name='country')),
                ('regions_city', models.CharField(max_length=200, verbose_name='regions_city')),
            ],
        ),
    ]