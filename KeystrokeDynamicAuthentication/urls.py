"""
SKDA URL configuration — API-only.

The user-facing UI lives in `/frontend` (React + Vite). Django here is
purely a JSON backend; the only routes are:

  /admin/   — Django's built-in admin panel
  /api/...  — REST endpoints consumed by the React app
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('KeystrokeDynamicAuthentication.api_urls')),
]

# Serve uploaded files (e.g. /media/data.csv) in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
