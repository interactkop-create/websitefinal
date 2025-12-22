from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime
from bson import ObjectId

from models import (
    User, UserCreate, UserLogin,
    BoardMember, BoardMemberCreate, BoardMemberUpdate,
    PastEvent, PastEventCreate, PastEventUpdate,
    UpcomingEvent, UpcomingEventCreate, UpcomingEventUpdate,
    NewsArticle, NewsArticleCreate, NewsArticleUpdate,
    GalleryImage, GalleryImageCreate,
    ContactSubmit
)
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from seed_data import (
    BOARD_MEMBERS_SEED, PAST_EVENTS_SEED, UPCOMING_EVENTS_SEED,
    NEWS_ARTICLES_SEED, GALLERY_IMAGES_SEED
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper function to convert MongoDB document to dict
def doc_to_dict(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new admin user."""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = {
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name,
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    return {"message": "User created successfully", "user": User(**user_dict)}


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login and get JWT token."""
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    token = create_access_token(data={"sub": str(user["_id"]), "email": user["email"]})
    
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"]
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info."""
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user.get("role", "admin")
    }


# ==================== BOARD MEMBERS ROUTES ====================

@api_router.get("/board-members", response_model=List[BoardMember])
async def get_board_members():
    """Get all board members (public)."""
    members = await db.board_members.find().sort("order", 1).to_list(100)
    return [BoardMember(**doc_to_dict(member)) for member in members]


@api_router.post("/board-members", response_model=BoardMember)
async def create_board_member(
    member_data: BoardMemberCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new board member (admin only)."""
    member_dict = member_data.dict()
    member_dict["created_at"] = datetime.utcnow()
    member_dict["updated_at"] = datetime.utcnow()
    
    result = await db.board_members.insert_one(member_dict)
    member_dict["_id"] = str(result.inserted_id)
    
    return BoardMember(**member_dict)


@api_router.put("/board-members/{member_id}", response_model=BoardMember)
async def update_board_member(
    member_id: str,
    member_data: BoardMemberUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a board member (admin only)."""
    update_data = {k: v for k, v in member_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.board_members.find_one_and_update(
        {"_id": ObjectId(member_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    return BoardMember(**doc_to_dict(result))


@api_router.delete("/board-members/{member_id}")
async def delete_board_member(
    member_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a board member (admin only)."""
    result = await db.board_members.delete_one({"_id": ObjectId(member_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    return {"message": "Board member deleted successfully"}


# ==================== PAST EVENTS ROUTES ====================

@api_router.get("/events/past", response_model=List[PastEvent])
async def get_past_events():
    """Get all past events (public)."""
    events = await db.past_events.find().sort("date", -1).to_list(100)
    return [PastEvent(**doc_to_dict(event)) for event in events]


@api_router.post("/events/past", response_model=PastEvent)
async def create_past_event(
    event_data: PastEventCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new past event (admin only)."""
    event_dict = event_data.dict()
    event_dict["created_at"] = datetime.utcnow()
    event_dict["updated_at"] = datetime.utcnow()
    
    result = await db.past_events.insert_one(event_dict)
    event_dict["_id"] = str(result.inserted_id)
    
    return PastEvent(**event_dict)


@api_router.put("/events/past/{event_id}", response_model=PastEvent)
async def update_past_event(
    event_id: str,
    event_data: PastEventUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a past event (admin only)."""
    update_data = {k: v for k, v in event_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.past_events.find_one_and_update(
        {"_id": ObjectId(event_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Past event not found")
    
    return PastEvent(**doc_to_dict(result))


@api_router.delete("/events/past/{event_id}")
async def delete_past_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a past event (admin only)."""
    result = await db.past_events.delete_one({"_id": ObjectId(event_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Past event not found")
    
    return {"message": "Past event deleted successfully"}


# ==================== UPCOMING EVENTS ROUTES ====================

@api_router.get("/events/upcoming", response_model=List[UpcomingEvent])
async def get_upcoming_events():
    """Get all upcoming events (public)."""
    events = await db.upcoming_events.find().sort("date", 1).to_list(100)
    return [UpcomingEvent(**doc_to_dict(event)) for event in events]


@api_router.post("/events/upcoming", response_model=UpcomingEvent)
async def create_upcoming_event(
    event_data: UpcomingEventCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new upcoming event (admin only)."""
    event_dict = event_data.dict()
    event_dict["created_at"] = datetime.utcnow()
    event_dict["updated_at"] = datetime.utcnow()
    
    result = await db.upcoming_events.insert_one(event_dict)
    event_dict["_id"] = str(result.inserted_id)
    
    return UpcomingEvent(**event_dict)


@api_router.put("/events/upcoming/{event_id}", response_model=UpcomingEvent)
async def update_upcoming_event(
    event_id: str,
    event_data: UpcomingEventUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an upcoming event (admin only)."""
    update_data = {k: v for k, v in event_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.upcoming_events.find_one_and_update(
        {"_id": ObjectId(event_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Upcoming event not found")
    
    return UpcomingEvent(**doc_to_dict(result))


@api_router.delete("/events/upcoming/{event_id}")
async def delete_upcoming_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an upcoming event (admin only)."""
    result = await db.upcoming_events.delete_one({"_id": ObjectId(event_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Upcoming event not found")
    
    return {"message": "Upcoming event deleted successfully"}


# ==================== NEWS ROUTES ====================

@api_router.get("/news", response_model=List[NewsArticle])
async def get_news():
    """Get all news articles (public)."""
    articles = await db.news.find().sort("date", -1).to_list(100)
    return [NewsArticle(**doc_to_dict(article)) for article in articles]


@api_router.post("/news", response_model=NewsArticle)
async def create_news(
    article_data: NewsArticleCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new news article (admin only)."""
    article_dict = article_data.dict()
    article_dict["created_at"] = datetime.utcnow()
    article_dict["updated_at"] = datetime.utcnow()
    
    result = await db.news.insert_one(article_dict)
    article_dict["_id"] = str(result.inserted_id)
    
    return NewsArticle(**article_dict)


@api_router.put("/news/{article_id}", response_model=NewsArticle)
async def update_news(
    article_id: str,
    article_data: NewsArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a news article (admin only)."""
    update_data = {k: v for k, v in article_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.news.find_one_and_update(
        {"_id": ObjectId(article_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="News article not found")
    
    return NewsArticle(**doc_to_dict(result))


@api_router.delete("/news/{article_id}")
async def delete_news(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a news article (admin only)."""
    result = await db.news.delete_one({"_id": ObjectId(article_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News article not found")
    
    return {"message": "News article deleted successfully"}


# ==================== GALLERY ROUTES ====================

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery():
    """Get all gallery images (public)."""
    images = await db.gallery.find().sort("created_at", -1).to_list(100)
    return [GalleryImage(**doc_to_dict(image)) for image in images]


@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(
    image_data: GalleryImageCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add a new gallery image (admin only)."""
    image_dict = image_data.dict()
    image_dict["created_at"] = datetime.utcnow()
    
    result = await db.gallery.insert_one(image_dict)
    image_dict["_id"] = str(result.inserted_id)
    
    return GalleryImage(**image_dict)


@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(
    image_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a gallery image (admin only)."""
    result = await db.gallery.delete_one({"_id": ObjectId(image_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    
    return {"message": "Gallery image deleted successfully"}


# ==================== CONTACT ROUTES ====================

@api_router.post("/contact/submit")
async def submit_contact(contact_data: ContactSubmit):
    """Submit a contact form (public)."""
    # Store in database for admin to review
    contact_dict = contact_data.dict()
    contact_dict["created_at"] = datetime.utcnow()
    contact_dict["status"] = "new"
    
    await db.contact_submissions.insert_one(contact_dict)
    
    return {"message": "Thank you for contacting us. We'll get back to you soon."}


# ==================== SEED DATA ROUTE ====================

@api_router.post("/seed-database")
async def seed_database():
    """Seed the database with initial data. Use only once for setup."""
    # Check if data already exists
    existing_members = await db.board_members.count_documents({})
    if existing_members > 0:
        return {"message": "Database already has data. Skipping seed."}
    
    # Insert seed data
    if BOARD_MEMBERS_SEED:
        for member in BOARD_MEMBERS_SEED:
            member["created_at"] = datetime.utcnow()
            member["updated_at"] = datetime.utcnow()
        await db.board_members.insert_many(BOARD_MEMBERS_SEED)
    
    if PAST_EVENTS_SEED:
        for event in PAST_EVENTS_SEED:
            event["created_at"] = datetime.utcnow()
            event["updated_at"] = datetime.utcnow()
        await db.past_events.insert_many(PAST_EVENTS_SEED)
    
    if UPCOMING_EVENTS_SEED:
        for event in UPCOMING_EVENTS_SEED:
            event["created_at"] = datetime.utcnow()
            event["updated_at"] = datetime.utcnow()
        await db.upcoming_events.insert_many(UPCOMING_EVENTS_SEED)
    
    if NEWS_ARTICLES_SEED:
        for article in NEWS_ARTICLES_SEED:
            article["created_at"] = datetime.utcnow()
            article["updated_at"] = datetime.utcnow()
        await db.news.insert_many(NEWS_ARTICLES_SEED)
    
    if GALLERY_IMAGES_SEED:
        for image in GALLERY_IMAGES_SEED:
            image["created_at"] = datetime.utcnow()
        await db.gallery.insert_many(GALLERY_IMAGES_SEED)
    
    return {"message": "Database seeded successfully"}


# ==================== ROOT ROUTE ====================

@api_router.get("/")
async def root():
    return {"message": "Interact Club of Kolhapur API", "version": "1.0.0"}


# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()