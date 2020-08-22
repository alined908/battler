from enum import IntEnum

class BattleSize(IntEnum):
    TWO = 2
    THREE = 3
    FOUR = 4

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class GameSize(IntEnum):
    TWO = 2
    THREE = 3
    FOUR = 4

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class TournamentPrivacy(IntEnum):
    PRIVATE = 1
    PUBLIC = 2
    FRIENDS = 3

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]