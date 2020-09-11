from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name='tournament'

urlpatterns = [
    path('login/', views.LoginView.as_view()),
    path('refresh_token/', TokenRefreshView.as_view()),
    path('auth/twitch/', views.TwitchOAuthView.as_view()),
    path('users/', views.UserListView.as_view()),
    path('users/<username>/', views.UserView.as_view()),
    path('users/<username>/tournaments/', views.UserTournamentsView.as_view()),
    path('games/', views.GamesView.as_view()),
    path('search/tournaments/', views.SearchTournamentView.as_view()),
    path('tournaments/', views.TournamentListView.as_view()),
    path('tournaments/<url>/', views.TournamentView.as_view()),
    path('tournaments/<url>/game/', views.GameView.as_view()),
    path('tournaments/<url>/game/<game_id>/bracket/', views.BracketView.as_view()),
    path('tournaments/<url>/battle/<battle_id>/', views.BattleView.as_view()),
    path('tournaments/<url>/entry/', views.TournamentEntryListView.as_view()),
    path('tournaments/<url>/entry/<entry_id>/', views.TournamentEntryView.as_view())
]