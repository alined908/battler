from ..models import User, Tournament, TournamentEntry

def create_user(username: str, password: str, email: str) -> User:
    try:
        user = User.objects.get(username=username)
        return user
    except User.DoesNotExist:
        return User.objects.create_user(username=username, password=password, email=email)

def create_tournament(description: str, title: str, creator: int, privacy: int, is_nsfw: bool, password = None) -> Tournament:
    return Tournament.objects.create(description=description, title=title, creator_id=creator, privacy=privacy, is_nsfw=is_nsfw, password = password)

def create_tournament_entry(title: str, tournament: Tournament) -> TournamentEntry:
    return TournamentEntry.objects.create(title=title, tournament=tournament)