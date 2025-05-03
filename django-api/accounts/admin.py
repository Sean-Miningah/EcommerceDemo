from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for the User model.
    """

    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active', 'created_at')

    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'created_at')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
        ('Role', {'fields': ('role',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'role', 'phone_number'),
        }),
    )

    search_fields = ('email', 'first_name', 'last_name')

    ordering = ('email',)

    readonly_fields = ('last_login', 'created_at', 'updated_at')
    filter_horizontal = ('groups', 'user_permissions',)

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)

admin.site.register(User, UserAdmin)

