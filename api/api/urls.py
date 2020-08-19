from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from tournament.views import LoginView

urlpatterns = [
    path('api/', include('tournament.urls')),
    path('login/', LoginView.as_view()),
    path('refresh_token/', TokenRefreshView.as_view())
]
