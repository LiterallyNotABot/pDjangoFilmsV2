FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .
RUN apt-get update \
    && apt-get install -y gcc libpq-dev netcat-openbsd \
    && pip install --upgrade pip \
    && pip install -r requirements.txt


COPY . .