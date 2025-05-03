from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """
    Inline admin configuration for OrderItem.
    Allows viewing/editing OrderItems directly within the Order admin page.
    """
    model = OrderItem
    fields = ('product', 'quantity', 'price', 'total_price')
    readonly_fields = ('price', 'total_price')
    extra = 0
    can_delete = False

    def total_price(self, obj):
        """Calculated field for the inline display."""
        return obj.total_price
    total_price.short_description = 'Total Price'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Order model.
    """
    list_display = ('id', 'user', 'status', 'total_amount', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'user')
    search_fields = ('id', 'user__email', 'items__product__name')
    readonly_fields = ('user', 'total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline] # Embed OrderItem management within the Order page
    list_per_page = 25
