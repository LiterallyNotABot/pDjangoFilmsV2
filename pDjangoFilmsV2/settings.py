"""
Django settings for pDjangoFilmsV2 project.

Generated by 'django-admin startproject' using Django 5.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""
import os
from datetime import timedelta
from pathlib import Path

from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3o9s_tc4$(k-nl0nv^p+b2x)kna02x@h5&em&lm)w)e(4vu+p%'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'daphne', # DEBE ESTAR ANTES DE contrib.staticfiles
    'django.contrib.staticfiles',

    # MY APPS
    'activity',
    'comms',
    'core',
    'films',
    'integrations',
    'reviews',
    'search',
    'store',
    'users',

    # OTHER
    'rest_framework',
    'rest_framework_simplejwt',
    'django_extensions',
    'rest_framework_api_key',
    'channels',
    'drf_spectacular',
    'corsheaders',
    'cloudinary',
    'cloudinary_storage',
    'django_elasticsearch_dsl',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # ANTES DEL COMMONMIDDLEWARE
    'core.middlewares.react_access.OnlyReactAccessMiddleware',
  # 'core.middlewares.timing_middleware.TimingMiddleware', # TESTING
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'pDjangoFilmsV2.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pDjangoFilmsV2.wsgi.application'
ASGI_APPLICATION = 'pDjangoFilmsV2.asgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'DjangoFilmsDB',
        'USER': 'postgres',
        'PASSWORD': '1234',
        # LOCAL:
        'HOST': 'localhost',
        # DOCKER:
        # 'HOST': 'db',
        'PORT': '5432',
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'staticfiles']
STATIC_ROOT = BASE_DIR / 'static'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# INTEGRATIONS
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework_api_key.permissions.HasAPIKey',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# COMMS
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
             "hosts": [('127.0.0.1', 6379)], # original
               # "hosts": [('redis', 6379)], # container
        },
    },
}

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

 # CORS AUTH
CORS_ALLOWED_ORIGINS = [
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:8080",
    "http://127.0.0.1:9000",
    "http://localhost:5173",
    "http://localhost:5174",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-Internal-Access",
]

SIMPLE_JWT = {
    "SIGNING_KEY": SECRET_KEY,
    "ALGORITHM": "HS256",
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

 # STATIC FILES STORAGE API
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

ELASTICSEARCH_DSL = {
    'default': {
        'hosts': 'http://localhost:9200',
    },
}



# TESTING RESPONSE AUTH - ONLY IF DEBUG - USER CREDENTIALS MUST BE HASHED
# PASSWORD_HASHERS = [ 'django.contrib.auth.hashers.MD5PasswordHasher', ]

'''
    # TESTING
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,  # Asegúrate de que otros loggers sigan funcionando
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {name} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',  # Usa formato legible
        },
    },
    'loggers': {
        # Logger general para todo
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        # Logger específico para tu middleware
        'utils.middlewares.timing_middleware': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',  # O ajusta si quieres ver más cosas globalmente
    },
}
'''

# KEYS
STRIPE_SECRET_KEY = "sk_test_51QuZCQPdMh0chZHFYp8nRrBRKEYncGoaNefqfKSqKprIdP6pKYa26SqW5g8zqivZwQKrBZdK4NsYL09VzOxrp7ND00u6cY2GL1"
STRIPE_PUBLIC_KEY = "pk_test_51QuZCQPdMh0chZHFFpXhHCl8rOd0YxGljroiPsVZAvIFPTUdfvBrfPqfKm6vhM8PT8gf9lZEMnhCBXwiP5QJJLjd00oNtsMMxS"
STRIPE_WEBHOOK_SECRET = "whsec_10229ca2e350c85ee83bb1c9440526a6c3d248d36090909ed72a79d5ecc81513"

