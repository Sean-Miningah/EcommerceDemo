from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Category model.
    """
    list_display = ('name',)



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Product model.
    """
    list_display = ('name', 'category', 'price', 'created_at', 'updated_at')
    list_filter = ('category', 'created_at')
    list_editable = ('price',)
    search_fields = ('name', 'description', 'category__name')
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25

    fieldsets = (
        (None, {
            'fields': ('category', 'name', 'description')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )