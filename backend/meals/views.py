

from rest_framework.response import Response
from rest_framework import status  
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes    
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY
@api_view(['POST'])
def create_checkout_session(request):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"{request.data.get('meal_name', 'Meal Plan')} ({request.data.get('plan_type', 'weekly')})",
                    },
                    'unit_amount': int(float(request.data['amount']) * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',  # Use 'subscription' for recurring payments
            success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/cancel',
            metadata={
                'meal_id': request.data.get('meal_id'),
                'plan_type': request.data.get('plan_type'),
                'meals_per_day': request.data.get('meals_per_day')
            }
        )
        return Response({'sessionId': session.id})
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verify_payment(request):
    try:
        session_id = request.GET.get('session_id')
        session = stripe.checkout.Session.retrieve(
            session_id,
            expand=['line_items']
        )
        
        return Response({
            'payment_intent': session.payment_intent,
            'amount_total': session.amount_total,
            'plan_name': session.line_items.data[0].description,
            'customer_email': session.customer_details.email,
            'metadata': session.metadata
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_delivery_address(request):
    try:
        from .models import Subscription
        Subscription = Subscription.objects.create(
            user=request.user,
            session_id=request.data.get('session_id'),
            street=request.data.get('street'),
            city=request.data.get('city'),
            state=request.data.get('state'),
            zip_code=request.data.get('zip'),
            phone=request.data.get('phone'),
            meal_plan=request.data.get('metadata', {}).get('plan_type'),
            meals_per_day=request.data.get('metadata', {}).get('meals_per_day')
        )
        
        return Response({'status': 'success'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)