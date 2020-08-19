# Reddit subreddits celebrities, r/goddesses, r/models. Let's get entities
# Reddit subreddits for male models

# Features
- Vote between two entities (shareable link)
- Leaderboard showing elo rating 
- Frontend has a show/hide nsfw switch
- Tourney style (users can add links to gifs, images, or upload images)

# Database
- Entity
    - name
    - media (array)

- Tournament
    - pk (hash)
    - title
    - creator (user fk)
    - date

- Game
    - user fk (optional)
    - bracket size int
    - Generate battles ()

- Battle 
    - Entity 1 
    - Entity 2
    