from django.urls import path
from .views import DietPlanList
urlpatterns = [
    path('meals/', DietPlanList.as_view(), name='meal-list'),
   
]