from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AuthorSchema(BaseModel):
    first_name: str
    last_name: str
    occupation: Optional[str] = None
    bio: Optional[str] = None

    model_config = {"from_attributes": True}


class BlogPostListItem(BaseModel):
    id: int
    title: str
    slug: str
    meta_description: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[AuthorSchema] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class BlogPostDetail(BaseModel):
    id: int
    title: str
    slug: str
    body: str
    meta_description: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[AuthorSchema] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedBlogPosts(BaseModel):
    items: list[BlogPostListItem]
    total: int
    page: int
    per_page: int
    total_pages: int
