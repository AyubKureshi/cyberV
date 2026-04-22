from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

targets_collection = None  # Default to None

try:
    client = MongoClient(
        MONGO_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        maxPoolSize=50
    )
    client.admin.command('ping')
    print("✓ MongoDB connection established")
    db = client["cybervision"]
    targets_collection = db["targets"]
except Exception as e:
    print("❌ MongoDB connection failed:", e)