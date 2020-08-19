from rest_framework import status
from rest_framework.test import APITestCase
from .utils import create_user

class AuthenticationTest(APITestCase):
    
    def __init__(self, *args, **kwargs):
        self.user_data = {
            'username': 'username',
            'email': 'test@example.com',
            'password': 'password',
            'confirm_password': 'password'
        }

        super(AuthenticationTest, self).__init__(*args, **kwargs)

    def test_user_password_not_match(self):
        data = self.user_data
        data['confirm_password'] = 'password1'

        response = self.client.post('/api/users/', data = data)

        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)

    def test_user_sign_up(self):
        response = self.client.post('/api/users/', data = self.user_data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

    def test_user_login(self):
        data = self.user_data
        del data['confirm_password']
        user = create_user(**data)
        
        response = self.client.post('/login/', 
            data = {
                'username': user.username,
                'password': 'password'
            }
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)


    
