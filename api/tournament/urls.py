from django.urls import path
from . import views

app_name='tournament'

urlpatterns = [
    path('users/', views.UserListView.as_view()),
    path('users/<id>/', views.UserView.as_view()),
    path('tournaments/', views.TournamentListView.as_view()),
    path('tournaments/<id>/', views.TournamentView.as_view()),
    path('tournaments/<id>/game/', views.GameView.as_view()),
    path('tournaments/<id>/battle/<battle_id>/', views.BattleView.as_view()),
    path('tournaments/<id>/photos/', views.TournamentEntryListView.as_view())
]