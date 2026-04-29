import math
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from db import init_db, get_db
from models import BlogPost, User, Profile
from schemas import BlogPostListItem, BlogPostDetail, PaginatedBlogPosts, AuthorSchema


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="OvercomerPoolCue Blog API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _build_author(user: Optional[User]) -> Optional[AuthorSchema]:
    if user is None or user.profile is None:
        return None
    return AuthorSchema(
        first_name=user.profile.first_name,
        last_name=user.profile.last_name,
        occupation=user.profile.occupation,
        bio=user.profile.bio,
    )


@app.get("/api/blog", response_model=PaginatedBlogPosts)
async def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    base_query = (
        select(BlogPost)
        .options(selectinload(BlogPost.author).selectinload(User.profile))
        .where(BlogPost.is_published.is_(True))
    )
    if category:
        base_query = base_query.where(BlogPost.category == category)

    count_result = await db.execute(
        select(func.count()).select_from(base_query.subquery())
    )
    total = count_result.scalar_one()

    result = await db.execute(
        base_query.order_by(BlogPost.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    posts = result.scalars().all()

    items = [
        BlogPostListItem(
            id=p.id,
            title=p.title,
            slug=p.slug,
            meta_description=p.meta_description,
            featured_image=p.featured_image,
            category=p.category,
            author=_build_author(p.author),
            created_at=p.created_at,
        )
        for p in posts
    ]

    return PaginatedBlogPosts(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=math.ceil(total / per_page) if total else 0,
    )


@app.get("/api/blog/{slug}", response_model=BlogPostDetail)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost)
        .options(selectinload(BlogPost.author).selectinload(User.profile))
        .where(BlogPost.slug == slug, BlogPost.is_published.is_(True))
    )
    post = result.scalar_one_or_none()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return BlogPostDetail(
        id=post.id,
        title=post.title,
        slug=post.slug,
        body=post.body,
        meta_description=post.meta_description,
        featured_image=post.featured_image,
        category=post.category,
        author=_build_author(post.author),
        created_at=post.created_at,
        updated_at=post.updated_at,
    )


@app.get("/api/health")
async def health():
    return {"status": "ok"}
