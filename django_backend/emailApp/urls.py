from django.urls import path
from . import views

urlpatterns = [
    path('sendemail/', views.send_error_email , name='send_error_email'),
     path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
]