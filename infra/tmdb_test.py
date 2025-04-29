import requests
import json
import time

# Your TMDb API Key
API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'


def search_movies(title):
    search_url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': API_KEY,
        'query': title,
        'language': 'en-US',
        'page': 1
    }

    first_response = requests.get(search_url, params=params)

    if first_response.status_code != 200:
        print(f"Search error: {first_response.status_code}")
        return

    data = first_response.json()
    total_pages = data.get('total_pages', 1)
    total_results = data.get('total_results', 0)

    print(f"\nFound {total_results} results across {total_pages} pages.\n")

    # Loop through all pages
    for page in range(1, total_pages + 1):
        print(f"Fetching page {page}/{total_pages}...")
        params['page'] = page
        response = requests.get(search_url, params=params)

        if response.status_code != 200:
            print(f"Error fetching page {page}: {response.status_code}")
            continue

        results = response.json().get('results', [])

        for movie in results:
            movie_id = movie['id']
            movie_title = movie['title']
            release_date = movie.get('release_date', 'No release date')

            print("=" * 50)
            print(f"Movie: {movie_title} ({release_date})")

            # Get movie details
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'

            details_params = {
                'api_key': API_KEY,
                'language': 'en-US'
            }

            details_response = requests.get(details_url, params=details_params)
            credits_response = requests.get(credits_url, params=details_params)

            if details_response.status_code != 200 or credits_response.status_code != 200:
                print(f"Error fetching data for movie ID {movie_id}")
                continue

            details = details_response.json()
            credits = credits_response.json()

            # Print full movie details
            print("\nMovie Details JSON:")
            print(json.dumps(details, indent=4, ensure_ascii=False))

            # Print full cast
            print("\nFull Cast:")
            for actor in credits.get('cast', []):
                print(f"- {actor.get('name')} as {actor.get('character')}")

            # Print full crew
            print("\nFull Crew:")
            for crew_member in credits.get('crew', []):
                print(f"- {crew_member.get('job')}: {crew_member.get('name')}")

            # Print production companies
            print("\nProduction Companies:")
            for company in details.get('production_companies', []):
                print(f"- {company.get('name')}")

            print("\n")

            time.sleep(0.2)  # Small delay to be safe (adjustable)


if __name__ == '__main__':
    title = input("Enter the movie title to search: ")
    search_movies(title)
