#models.py
from django.db import models
from django.contrib.auth import get_user_model
class DietPlan(models.Model):
  
    name = models.CharField(max_length=100, help_text="Name of the diet plan")
    MEAL_TYPES = [
        ('VG', 'Vegetarian'),
        ('NV', 'Non-Vegetarian'),
        ('VGN', 'Vegan'),
    ]
    meal_type = models.CharField(
        max_length=3,
        choices=MEAL_TYPES,
        help_text="Type of meal (Vegetarian/Non-Vegetarian/Vegan)"
    )
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Price per meal in USD"
    )

    def __str__(self):
        return f"{self.name} ({self.get_meal_type_display()})"
User = get_user_model()

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    meal_plan = models.CharField(max_length=50)
    meals_per_day = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email}'s subscription"