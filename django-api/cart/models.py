from django.db import models
from django.conf import settings
from products.models import Product

class CartItem(models.Model):
    """
    Shopping cart item model
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username}'s cart: {self.product.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.quantity * self.product.price