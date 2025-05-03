from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from cart.models import CartItem

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_admin

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for order management
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin users can see all orders, regular users only see their own
        if user.role == 'ADMIN' or user.is_staff or user.is_superuser :
            return Order.objects.all().prefetch_related('items__product')
        return Order.objects.filter(user=user).prefetch_related('items__product')

    def get_permissions(self):
        """
        Override to restrict update/delete to admin only
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def checkout(self, request):
        """
        Creates a new order from the user's cart
        """
        user = request.user
        cart_items = CartItem.objects.filter(user=user).select_related('product')

        if not cart_items.exists():
            return Response(
                {'error': 'Your cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate the total amount
        total_amount = sum(item.quantity * item.product.price for item in cart_items)

        # Create the order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            status='pending'
        )

        # Create order items
        order_items = []
        for cart_item in cart_items:
            order_item = OrderItem(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            order_items.append(order_item)

        OrderItem.objects.bulk_create(order_items)

        # Clear the cart
        cart_items.delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)