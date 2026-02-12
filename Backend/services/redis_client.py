"""
redis_client.py
Centralizovano mjesto za konekciju ka Redis-u.

Za sada koristimo default Redis URL:
redis://localhost:6379/0

Kasnije možete prebaciti u .env, ali i ovako radi odmah.
"""

import os
import redis


def get_redis_client() -> redis.Redis:
    # Ako jednog dana dodate .env, samo postavite REDIS_URL u environment.
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

    # decode_responses=True -> vraća stringove umjesto bytes (lakše za rad)
    return redis.Redis.from_url(redis_url, decode_responses=True)
