"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  
from rest_framework_simplejwt.views import ( 
    TokenObtainPairView,
    TokenRefreshView,TokenVerifyView 
)
from meals.views import create_checkout_session
from meals.api.views import DietPlanList
from meals.views import verify_payment, save_delivery_address
urlpatterns = [
    path('admin/', admin.site.urls),  
    
   
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('meals/', DietPlanList.as_view(), name='meal-list'),
    
    path('api/', include('meals.api.urls')), 
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
   path('api/create-checkout-session/', create_checkout_session, name='create-checkout-session'),
   path('api/verify-payment/', verify_payment, name='verify-payment'),
   path('api/save-delivery-address/', save_delivery_address, name='save-address'),
]