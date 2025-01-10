from django.urls import path
from . import views

urlpatterns = [
    path('get_all_roles/', views.get_all_roles, name='get_all_roles'),
    path('update_role/', views.update_role, name='update_role'),
    path('add_new_role/', views.add_new_role, name='add_new_role'),
    path('delete_role/', views.delete_role, name='delete_role'),
    path('get_all_users/', views.get_all_users, name='get_all_users'),
    path('update_user/', views.update_user, name='update_user'),
    path('add_new_user/', views.add_new_user, name='add_new_user'),
    path('delete_user/', views.delete_user, name='delete_user'),
    path('single_sign_in/', views.single_sign_in, name='single_sign_in'),
    path('verify_email_otp/', views.verify_email_otp, name='verify_email_otp'),
    path('logout_view/', views.logout_view, name='logout_view'),
    path('check_auth_status/', views.check_auth_status, name='check_auth_status'),
    path('save_or_update_draft/', views.save_or_update_draft, name='save_or_update_draft'),
    path('fetch_draft/',views.fetch_draft, name='fetch_draft')

]
