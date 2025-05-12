import requests
import json

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'  # Reemplaza con tu API key real
BASE_URL = 'https://api.themoviedb.org/3'

# ID de la película que quieres consultar, puedes cambiar este valor
MOVIE_ID = 27205  # Inception


def get_movie_images(movie_id):
    # Consultar imágenes de la película (posters y backdrops)
    url = f'{BASE_URL}/movie/{movie_id}/images?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()


def main():
    print("=== Obteniendo imágenes de la película ===")

    # Obtener las imágenes de la película
    images = get_movie_images(MOVIE_ID)

    if 'posters' in images:
        print("\n=== Posters de la película ===")

        # Buscar el poster en inglés
        english_poster = next((poster for poster in images['posters'] if poster.get('iso_639_1') == 'en'), None)

        if english_poster:
            # Construir la URL del poster en inglés
            poster_url = f"https://www.themoviedb.org/t/p/w500{english_poster['file_path']}"
            print(f"  Poster en inglés: {poster_url}")
        else:
            print("  No se encontró un poster en inglés.")

    if 'backdrops' in images:
        print("\n=== Backdrops de la película ===")
        for backdrop in images['backdrops']:
            # Construir la URL del fondo (backdrop)
            backdrop_url = f"https://www.themoviedb.org/t/p/w500{backdrop['file_path']}"
            print(f"  Backdrop: {backdrop_url}")


if __name__ == '__main__':
    main()
