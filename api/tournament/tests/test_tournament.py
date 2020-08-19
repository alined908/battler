from rest_framework import status
from rest_framework.test import APITestCase
from ..models import Game, Battle, Round
from .utils import create_user, create_tournament, create_tournament_entry
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import random

class TournamentTest(APITestCase):
    def setUp(self):
        self.user = create_user('username', 'password', 'test@gmail.com')
        self.tournament_data = {
            "description": "Test Run",
            "title": "Test",
            "privacy": 2,
            "is_nsfw": False,
            "creator": self.user.pk
        }

        self.game_data = {
            "bracket_size": 16
        }

    def test_tournament_create(self):
        response = self.client.post('/api/tournaments/', data = self.tournament_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test')
        self.assertEqual(response.data['description'], 'Test Run')

    def test_tournament_get(self):
        tournament = create_tournament(**self.tournament_data)
        response = self.client.get(f'/api/tournaments/{tournament.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_game_create(self):
        tournament = create_tournament(**self.tournament_data)

        for i in range(16):
            entry = create_tournament_entry("something" + str(i), tournament)

        response = self.client.post(f'/api/tournaments/{tournament.id}/game/', data = self.game_data)
        #print(json.dumps(response.data, indent=4))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['battles']), 8)
        self.assertIn('sessionid', response.client.cookies)

    def play_game(self, response, tournament):
        game_id = response.data['id']

        battles = {}
        num_battles = len(response.data['battles'])

        for battle in response.data['battles']:
            winner = random.choice(battle['entries'])
            battles[battle['id']] = winner['id']

        for battle_id in battles:
            response = self.client.patch(f'/api/tournaments/{tournament.id}/battle/{battle_id}/', {"winner": battles[battle_id]})

        response = self.client.get(f'/api/tournaments/{tournament.id}/game/')
        print(json.dumps(response.data, indent=4))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['battles']) * 2 or 1, num_battles)
        return response

    def test_game_advance_round(self):
        tournament = create_tournament(**self.tournament_data)

        for i in range(16):
            entry = create_tournament_entry("something" + str(i), tournament)

        response = self.client.post(f'/api/tournaments/{tournament.id}/game/', data = self.game_data)
        response = self.play_game(response, tournament)
        response = self.play_game(response, tournament)
        response = self.play_game(response, tournament)
        response = self.play_game(response, tournament)

class TournamentEntityTest(APITestCase):

    def setUp(self):
        self.user = create_user('username', 'password', 'test@gmail.com')
        self.tournament_data = {
            "description": "Test Run",
            "title": "Test",
            "privacy": 2,
            "is_nsfw": False,
            "creator": self.user.pk
        }

    def test_create_entity(self):
        tournament = create_tournament(**self.tournament_data)
        self.client.force_authenticate(user=self.user)

        mock = SimpleUploadedFile('file.png', b"file_content", content_type='image/png')

        self.entry_data = {
            "tournament": tournament.id,
            'title': 'something',
            'photo': mock
        }
        response = self.client.post(f'/api/tournaments/{tournament.id}/photos/', data=self.entry_data)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        
        

    