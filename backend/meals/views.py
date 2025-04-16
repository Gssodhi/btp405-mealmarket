
#views.py
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
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        # Extract data from request
        data = request.data
        user = request.user

        # Prepare Stripe session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"{data.get('meal_name', 'Meal Plan')} ({data.get('plan_type', 'weekly')})",
                    },
                    'unit_amount': int(float(data['amount']) * 100),  # cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=data.get('success_url', 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}'),
            cancel_url=data.get('cancel_url', 'http://localhost:3000/cancel'),
            metadata={
                'user_id': str(user.id),
                'meal_id': data.get('meal_id'),
                'plan_type': data.get('plan_type'),
                'meals_per_day': data.get('meals_per_day'),
                'street': data.get('street'),
                'city': data.get('city'),
                'state': data.get('state'),
                'zip': data.get('zip'),
                'phone': data.get('phone')
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
            'session_id': session.id,
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

        # Retrieve metadata from Stripe session
        session_id = request.data.get('session_id')
        session = stripe.checkout.Session.retrieve(session_id)
        metadata = session.metadata

        # Save subscription with delivery details
        Subscription.objects.create(
            user=request.user,
            session_id=session_id,
            street=metadata.get('street'),
            city=metadata.get('city'),
            state=metadata.get('state'),
            zip_code=metadata.get('zip'),
            phone=metadata.get('phone'),
            meal_plan=metadata.get('plan_type'),
            meals_per_day=metadata.get('meals_per_day')
        )

        return Response({'status': 'success'})

    except Exception as e:
        return Response({'error': str(e)}, status=400)
