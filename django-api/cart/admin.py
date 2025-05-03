from django.contrib import admin
from .models import CartItem


class CartItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for the CartItem model.
    """
    list_display = ('user', 'product', 'quantity', 'total_price', 'created_at', 'updated_at')
    list_filter = ('user', 'product', 'created_at')
    search_fields = ('user__email', 'product__name')
    readonly_fields = ('created_at', 'updated_at', 'total_price')
    list_per_page = 25

    fieldsets = (
        (None, {'fields': ('user', 'product', 'quantity')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

admin.site.register(CartItem, CartItemAdmin)
