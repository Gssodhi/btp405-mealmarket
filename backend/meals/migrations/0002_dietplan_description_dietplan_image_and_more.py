# Generated by Django 5.2 on 2025-04-14 22:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='dietplan',
            name='description',
            field=models.TextField(blank=True, help_text='Detailed description of the meal plan'),
        ),
        migrations.AddField(
            model_name='dietplan',
            name='image',
            field=models.ImageField(blank=True, help_text='Image of the meal plan', null=True, upload_to='meal_images/'),
        ),
        migrations.AddField(
            model_name='dietplan',
            name='is_active',
            field=models.BooleanField(default=True, help_text='Whether this plan is currently available'),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='meal_type',
            field=models.CharField(choices=[('VG', 'Vegetarian'), ('NV', 'Non-Vegetarian'), ('VGN', 'Vegan'), ('GF', 'Gluten-Free'), ('KF', 'Keto-Friendly')], help_text='Type of meal (Vegetarian/Non-Vegetarian/Vegan)', max_length=3),
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street_address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state_province', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=20)),
                ('country', models.CharField(default='Canada', max_length=100)),
                ('phone_number', models.CharField(max_length=20)),
                ('plan_type', models.CharField(choices=[('weekly', 'Weekly'), ('monthly', 'Monthly')], max_length=10)),
                ('meals_per_day', models.PositiveSmallIntegerField(default=1)),
                ('stripe_session_id', models.CharField(max_length=255, unique=True)),
                ('stripe_payment_intent', models.CharField(blank=True, max_length=255)),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=8)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('paused', 'Paused'), ('cancelled', 'Cancelled')], default='active', max_length=10)),
                ('diet_plan', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='subscriptions', to='meals.dietplan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscriptions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Meal Subscription',
                'verbose_name_plural': 'Meal Subscriptions',
                'ordering': ['-created_at'],
            },
        ),
    ]
