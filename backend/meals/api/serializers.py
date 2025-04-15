from rest_framework import serializers
from meals.models import DietPlan

class DietPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlan
        fields = '__all__'