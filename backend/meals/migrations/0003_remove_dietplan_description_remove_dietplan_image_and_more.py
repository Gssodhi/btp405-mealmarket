# Generated by Django 5.2 on 2025-04-14 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0002_dietplan_description_dietplan_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dietplan',
            name='description',
        ),
        migrations.RemoveField(
            model_name='dietplan',
            name='image',
        ),
        migrations.RemoveField(
            model_name='dietplan',
            name='is_active',
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='meal_type',
            field=models.CharField(choices=[('VG', 'Vegetarian'), ('NV', 'Non-Vegetarian'), ('VGN', 'Vegan')], help_text='Type of meal (Vegetarian/Non-Vegetarian/Vegan)', max_length=3),
        ),
        migrations.DeleteModel(
            name='Subscription',
        ),
    ]
