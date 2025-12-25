from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: EmailStr
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Board Member Models
class BoardMemberCreate(BaseModel):
    name: str
    position: str
    email: EmailStr
    image: str
    order: int = 0


class BoardMemberUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    email: Optional[EmailStr] = None
    image: Optional[str] = None
    order: Optional[int] = None


class BoardMember(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    position: str
    email: EmailStr
    image: str
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Event Models
class PastEventCreate(BaseModel):
    title: str
    date: str
    description: str
    images: List[str]


class PastEventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None


class PastEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    date: str
    description: str
    images: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UpcomingEventCreate(BaseModel):
    title: str
    date: str
    time: str
    venue: str
    description: str
    registration_open: bool = True


class UpcomingEventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    venue: Optional[str] = None
    description: Optional[str] = None
    registration_open: Optional[bool] = None


class UpcomingEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    date: str
    time: str
    venue: str
    description: str
    registration_open: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# News Models
class NewsArticleCreate(BaseModel):
    title: str
    date: str
    excerpt: str
    content: str
    image: str


class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None


class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    date: str
    excerpt: str
    content: str
    image: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Gallery Models
class GalleryImageCreate(BaseModel):
    url: str
    caption: str


class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    url: str
    caption: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


# Contact Models
class ContactSubmit(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactInfo(BaseModel):
    address: str
    email: EmailStr
    phone: Optional[str] = None
    office_hours: str


class ContactInfoUpdate(BaseModel):
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    office_hours: Optional[str] = None


# Site Settings Models
class SiteSettings(BaseModel):
    active_members: int = 50
    total_events: int = 20
    lives_impacted: int = 1000
    awards_won: int = 5
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SiteSettingsUpdate(BaseModel):
    active_members: Optional[int] = None
    total_events: Optional[int] = None
    lives_impacted: Optional[int] = None
    awards_won: Optional[int] = None