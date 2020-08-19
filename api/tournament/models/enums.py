from enum import IntEnum

class BracketTypes(IntEnum):
    ONE = 1
    TWO = 2
    FOUR = 4
    EIGHT = 8
    SIXTEEN = 16
    THIRTYTWO = 32
    SIXTYFOUR = 64

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class BattleSize(IntEnum):
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