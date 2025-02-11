FROM python:3.9-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

# Copy project
COPY . .

# Run migrations and collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Add these environment variables
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=Innovontech.settings
ENV WEBSITE_HTTPLOGGING_RETENTION_DAYS=7
ENV WEBSITES_PORT=8000
ENV CORS_ALLOW_ALL_ORIGINS=True
ENV DJANGO_CORS_ALLOW_ALL_ORIGINS=True

# Add this to your gunicorn command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "600", "--workers", "4", "Innovontech.wsgi:application"]

# Add environment variable validation and logging
# CMD ["sh", "-c", "echo 'Checking MongoDB URL...' && \
#      if [ -z \"$MONGO_URI\" ]; then \
#        echo 'ERROR: MONGO_URI is not set'; \
#        exit 1; \
#      fi && \
#      echo 'Starting Gunicorn...' && \
#      /usr/local/bin/gunicorn --bind 0.0.0.0:8000 Innovontech.wsgi:application"]