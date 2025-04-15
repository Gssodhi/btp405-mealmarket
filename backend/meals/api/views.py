from rest_framework import generics
from meals.models import DietPlan
from .serializers import DietPlanSerializer

class DietPlanList(generics.ListCreateAPIView):
    queryset = DietPlan.objects.all()
    serializer_class = DietPlanSerializer