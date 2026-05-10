from django.urls import path

from . import api_views

urlpatterns = [
    path('register/', api_views.api_register, name='api_register'),
    path('login/', api_views.api_login, name='api_login'),
    path('admin-login/', api_views.api_admin_login, name='api_admin_login'),
    path('change-password/', api_views.api_change_password, name='api_change_password'),
    path('users/', api_views.api_get_users, name='api_get_users'),
    path('activate-user/', api_views.api_activate_user, name='api_activate_user'),
    path('deactivate-user/', api_views.api_deactivate_user, name='api_deactivate_user'),
    path('dataset/', api_views.api_get_dataset, name='api_get_dataset'),
    path('classification/', api_views.api_classification, name='api_classification'),
    path('dashboard-stats/', api_views.api_dashboard_stats, name='api_dashboard_stats'),
    path('logout/', api_views.api_logout, name='api_logout'),
]
