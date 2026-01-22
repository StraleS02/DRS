from minio import Minio
import os

minio_client = Minio(
    os.getenv("MINIO_ENDPOINT"),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=os.getenv("MINIO_USE_SSL", "false").lower() == "true"
)

BUCKET_NAME = os.getenv("MINIO_BUCKET", "profile-images")

# Kreiraj bucket ako ne postoji
if not minio_client.bucket_exists(BUCKET_NAME):
    minio_client.make_bucket(BUCKET_NAME)
