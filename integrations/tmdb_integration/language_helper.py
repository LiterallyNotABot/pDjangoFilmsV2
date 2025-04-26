# Diccionario manual para mapear codigos ISO a nombre completo
ISO_639_1_MAP = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'pt': 'Portuguese',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'zh': 'Chinese',
    'ko': 'Korean',
    'ru': 'Russian',
    'ar': 'Arabic',
    # Agrega más si quieres
}

def iso_639_1_to_fullname(iso_code):
    if iso_code:
        return ISO_639_1_MAP.get(iso_code.lower(), iso_code.upper())
    return "Unknown"
