from pymongo import MongoClient
import os

# MongoDB connection URL (with env var support)
MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

try:
    # Create client with connection pooling
    client = MongoClient(
        MONGO_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        maxPoolSize=50
    )
    # Verify connection
    client.admin.command('ping')
    print("✓ MongoDB connection established")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

# Access database
db = client["cybervision"]

# Collections (like tables)
targets_collection = db["targets"]