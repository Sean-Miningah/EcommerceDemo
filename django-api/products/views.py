from django.db.models import Q
from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow admin users to have full access,
    while others can only read.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if user is admin for other methods
        return request.user and request.user.is_admin

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for categories
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products

    Filtering:
    - /api/products/?category=1
    - /api/products/?min_price=10&max_price=100

    Sorting:
    - /api/products/?ordering=price (ascending)
    - /api/products/?ordering=-price (descending)
    - /api/products/?ordering=name (alphabetical)
    - /api/products/?ordering=-name (reverse alphabetical)
    """
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category']
    ordering_fields = ['price', 'name']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset