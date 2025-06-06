ORDERING_CRITERIA = {
    "popularity": {
        "label": "Popularity",
        "order_by": "-popularity",
    },
    "releaseDate_desc": {
        "label": "Newest First",
        "order_by": "-release_year",
    },
    "releaseDate_asc": {
        "label": "Oldest First",
        "order_by": "release_year",
    },
    "filmLength_desc": {
        "label": "Longest",
        "order_by": "-runtime",
    },
    "filmLength_asc": {
        "label": "Shortest",
        "order_by": "runtime",
    },
    # futuros criterios:
    # "userRating_desc": {...}
}
