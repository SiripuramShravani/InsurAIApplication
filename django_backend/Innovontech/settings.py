"""
Django settings for Innovontech project.

Generated by 'django-admin startproject' using Django 5.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from dotenv import load_dotenv
import os

# load_dotenv(r'/var/www/inno-claim-fnol/back_end/django-backend/Innovontech/.env')
load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_ADMIN')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD')
JWT_SECRET_KEY = os.getenv('TOKEN_SECRET_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# DEBUG = False

ALLOWED_HOSTS = [
    '91.108.111.109', 
    '127.0.0.1',
    '10.0.2.2', 
    'insurai.innovontek.com', 
    'innovon.ai',
    'insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
]
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'Claim.apps.ClaimConfig',
    'AI.apps.AiConfig',
    'Policy.apps.PolicyConfig',
    'administration.apps.AdministrationConfig',
    'Batch_processes.apps.BatchProcessesConfig',
    'django_extensions',
    'emailApp',
]
CORS_ORIGIN_ALLOW_ALL=True
#CORS_ALLOW_ALL_ORIGINS = False
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
#     'https://localhost:3000',
#     'https://innovon.ai',
#     'https://localhost:3001',
#     'https://insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
# ]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.azurewebsites\.net$",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",  
    "https://localhost:3000",
    "https://innovon.ai",
    "http://10.0.2.2:8000",
    "https://10.0.2.2:8000",
    'https://localhost:3001',
    'https://insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net',
    'http://insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
]


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://innovon.ai",
    "http://10.0.2.2:8000",
    "https://10.0.2.2:8000",
    'https://localhost:3001',
    'https://insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net',
    'http://insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
]


CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]
# SESSION_COOKIE_SAMESITE = 'None'
# CSRF_COOKIE_SAMESITE = 'None'
# SESSION_COOKIE_SECURE = False
# CSRF_COOKIE_SECURE = False

SECURE_SSL_REDIRECT = True  # Redirect all HTTP traffic to HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SAMESITE = 'Strict'   
# CSRF_COOKIE_SAMESITE = 'Strict'
# SESSION_COOKIE_DOMAIN = 'innovon.ai'
# CSRF_COOKIE_DOMAIN = 'innovon.ai'
# CSRF_COOKIE_HTTPONLY = True
# SESSION_COOKIE_HTTPONLY = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Strict'   
CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_DOMAIN = 'insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
CSRF_COOKIE_DOMAIN = 'insuraibackend-hdazb3dgfqe3etbe.canadacentral-01.azurewebsites.net'
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Innovontech.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # This is the key line!
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Innovontech.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',  # Unique name for the cache
        'TIMEOUT': 3600,  # Cache expiration time (1 hour in seconds)
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}



# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = ['/var/www/inno-claim-fnol/react-frontend/build']

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_ROOT = os.path.join(BASE_DIR, 'Media')
MEDIA_URL = '/Media/'

