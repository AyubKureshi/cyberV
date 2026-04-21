from datetime import datetime
from bson import ObjectId
from app.db.mongo import targets_collection

CANCEL_FLAGS = {}

def _ensure_db_available():
    if targets_collection is None:
        raise RuntimeError("MongoDB is not available. Start MongoDB or set MONGODB_URI.")

# 2. Update create_target to initialize the flag
def create_target(url: str):
    _ensure_db_available()

    target = {
        "url": url,
        "status": "pending",
        "progress": 0,
        "endpoints": [],
        "created_at": datetime.utcnow()
    }

    result = targets_collection.insert_one(target)
    target_id = str(result.inserted_id)
    
    # Register this scan as active
    CANCEL_FLAGS[target_id] = False
    
    return target_id

# 3. Add this new function at the bottom of the file
def stop_target(target_id: str):
    _ensure_db_available()
    CANCEL_FLAGS[target_id] = True
    update_status(target_id, "stopped")


def update_progress(target_id, progress):
    _ensure_db_available()
    targets_collection.update_one(
        {"_id": ObjectId(target_id)},
        {"$set": {"progress": progress}}
    )


# Add endpoints (Crawler -> Controller)
def add_endpoints(target_id, endpoints):
    _ensure_db_available()
    targets_collection.update_one(
        {"_id": ObjectId(target_id)},
        {
            "$push": {
                "endpoints": {
                    "$each": [
                        {
                            "url": ep,
                            "method": "GET",
                            "status": "pending",
                            "vulnerabilities": []
                        }
                        for ep in endpoints
                    ]
                }
            }
        }
    )


# Add vulnerability (Worker -> Controller)
def add_vulnerability(target_id, endpoint_url, vuln):
    _ensure_db_available()
    targets_collection.update_one(
        {
            "_id": ObjectId(target_id),
            "endpoints.url": endpoint_url
        },
        {
            "$push": {
                "endpoints.$.vulnerabilities": vuln
            }
        }
    )


def update_endpoint_status(target_id, endpoint_url, status):
    _ensure_db_available()
    targets_collection.update_one(
        {
            "_id": ObjectId(target_id),
            "endpoints.url": endpoint_url
        },
        {
            "$set": {
                "endpoints.$.status": status
            }
        }
    )


# Update status
def update_status(target_id, status):
    _ensure_db_available()
    targets_collection.update_one(
        {"_id": ObjectId(target_id)},
        {"$set": {"status": status}}
    )
