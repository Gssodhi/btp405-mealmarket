from django.db import models

class DietPlan(models.Model):
    """Represents a diet plan (veg/non-veg/vegan) for the marketplace."""
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