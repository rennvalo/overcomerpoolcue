#!/usr/bin/env python3
"""
Automated SEO Blog Article Generator for overcomerpoolcue.com

Generates 1500+ word SEO-optimized pool cue articles using a Gemini LLM
(with multi-key fallback and local endpoint fallback), publishes them to
the database, fetches a matching Unsplash image, and assigns a realistic
fake human author.

Usage:
    python scripts/fullarticlegen.py --test           # Run once and exit
    python scripts/fullarticlegen.py --interval 24    # Run every 24 hours
"""

import asyncio
import argparse
import json
import os
import random
import re
import secrets
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional
from urllib.parse import quote_plus

import google.generativeai as genai
import httpx
from dotenv import load_dotenv
from sqlalchemy import select

# ── load .env ────────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).parent.parent.parent / ".env")

# ── path so we can import backend modules ────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent.parent))
from db import async_session_maker, init_db
from models import BlogPost, User, Profile
from auth import get_password_hash

# ── env vars ─────────────────────────────────────────────────────────────────
LLM_PROVIDER     = os.getenv("LLM_PROVIDER", "Gemini")
GEMINI_MODELS    = ["gemini-2.5-flash", "gemini-2.5-flash-lite"]
GEMINI_API_KEYS  = [
    k for k in [
        os.getenv("GEMINI_API_KEY"),
        os.getenv("GEMINI_API_KEY2"),
        os.getenv("GEMINI_API_KEY3"),
    ] if k
]
LLM_ENDPOINT         = os.getenv("LLM_ENDPOINT", "")
UNSPLASH_ACCESS_KEY  = os.getenv("UNSPLASH_ACCESS_KEY", "")
ARTICLE_BOT_USERNAME = os.getenv("ARTICLE_BOT_USERNAME", "article_bot")
ARTICLE_BOT_PASSWORD = os.getenv("ARTICLE_BOT_PASSWORD", "article_bot_2025")
SITE_URL             = os.getenv("SITE_DOMAIN", "https://overcomerpoolcue.com")

# ─────────────────────────────────────────────────────────────────────────────
# TOPIC LISTS
# ─────────────────────────────────────────────────────────────────────────────

POOL_TIPS_TOPICS = [
    # Fundamentals
    "How to Master the Perfect Pool Stance for Beginners",
    "Understanding Cue Ball Control: The Foundation of Great Pool",
    "How to Aim Better in Pool: Proven Techniques That Work",
    "The Correct Way to Hold a Pool Cue for Maximum Accuracy",
    "Ghost Ball Method Explained: Pocket Balls Every Time",
    "How to Use English (Side Spin) Effectively in Pool",
    "Top Spin vs Back Spin: When and How to Use Each",
    "How to Break Effectively in 8-Ball Pool",
    "How to Break in 9-Ball: Power, Aim, and Control",
    "Reading the Table: Strategic Thinking in Pool",
    "How to Play Safe: Defensive Pool Strategy Explained",
    "Cluster Busting Techniques Every Pool Player Needs",
    "How to Run Out in 8-Ball: Planning Your Shot Sequence",
    "Pattern Play in 9-Ball: Controlling the Cue Ball",
    "How to Master the Stop Shot in Pool",
    "Draw Shot Technique: Getting Maximum Backspin",
    "How to Execute a Perfect Stun Shot",
    "The Follow Shot: Using Top Spin to Your Advantage",
    "Masse Shot Tutorial for Intermediate Players",
    "Jump Shot Fundamentals: When and How to Use Them",
    "How to Practice Pool Alone and Improve Faster",
    "Drills to Improve Cue Ball Position Control",
    "Bank Shot Strategy: Angles, Speed, and Spin",
    "Combination Shots: When to Shoot Them and When to Avoid",
    "Carom Shots: Using Object Balls to Pocket Others",
    "How to Read Rails and Cushions Like a Pro",
    "Speed Control in Pool: The Most Underrated Skill",
    "Mental Game in Pool: Staying Focused Under Pressure",
    "Pre-Shot Routine: Why Consistency Beats Talent",
    "How to Identify and Fix Your Pool Stroke Problems",
    "Common Mistakes Beginners Make in Pool (And How to Fix Them)",
    "How to Practice Pool When You Only Have 30 Minutes",
    "The Art of the Safety in 10-Ball Pool",
    "How to Play One-Pocket: Strategy for Advanced Players",
    "Straight Pool (14.1): The Game That Built Champions",
    "How to Play 8-Ball by Official World Rules",
    "Three-Cushion Billiards: The Hardest Cue Sport Explained",
    "How to Win More Pool Matches Through Smart Shot Selection",
    "Pocket Speed: How Hard to Hit Shots in Pool",
    "Long Straight Shots: How to Sink Them Consistently",
    "Cut Shot Mastery: Pocketing Balls at Extreme Angles",
    "How to Handle Awkward Cue Ball Positions",
    "Playing from the Kitchen: Breaking Out of Tight Spots",
    "How to Use the Rails to Your Advantage",
    "The Half-Ball Hit: Your Most Reliable Reference Point",
    "Thin Cut Shots: Precision Technique for Advanced Players",
    "How to Practice the 9-Ball Pattern on Your Own",
    "Building a Solid Warm-Up Routine Before Pool Matches",
    "How to Develop Consistent Stroke Mechanics",
    "The Psychology of Pool: Winning the Mental Battle",
    "How to Handle Nerves During Tournament Pool",
    "Watching Professional Pool to Improve Your Game",
    "How to Film Your Pool Game and Analyze Your Mistakes",
    "Pool Table Maintenance Tips Every Player Should Know",
    "How to Choose a Pool Room and Find Good Competition",
    "Playing Pool Under Bar Rules vs Tournament Rules",
    "How to Hustle at Pool (The Legal Way)",
    "From Beginner to Intermediate: A Pool Player's Roadmap",
    "How to Achieve a Smooth Pendulum Stroke in Pool",
    "Kick Shots: Finding the Right Angle Every Time",
    "How to Play on Different Table Sizes (7ft, 8ft, 9ft)",
    "Rail Bridge vs Closed Bridge: Which Should You Use?",
    "Open Bridge Technique: The Foundation of Your Stroke",
    "Closed Bridge Mastery for Tight-Angle Shots",
    "Mechanical Bridge: Overcoming the Reach Problem",
    "How to Handle Frozen Balls in Pool",
    "Lagging for Break: How to Win the Toss",
    "8-Ball Solids vs Stripes Strategy: Smart Shot Selection",
    "How to Play Pool on a Fast Table vs a Slow Table",
    "New Cloth vs Old Cloth: Adjusting Your Game",
    "Chalk Properly: The Step Everyone Skips",
    "Ferrule and Tip Maintenance for Better Shots",
    "When to Replace Your Cue Tip: Signs and Tips",
    "How to Shape a Cue Tip for Maximum Control",
    "Hard Tip vs Soft Tip: Which Is Right for Your Game?",
    "Leather vs Phenolic Tips: A Complete Comparison",
    "How Cue Weight Affects Your Shooting Style",
    "How Cue Balance Point Affects Your Game",
    "Understanding Shaft Deflection in Pool Cues",
    "Low Deflection Shafts: Do They Really Help?",
    "Carbon Fiber Shafts: Are They Worth the Investment?",
    "How Grip Affects Your Pool Game",
    "Irish Linen Wrap vs Leather Wrap: A Comparison",
    "Stainless Steel Joints: Why They Matter",
    "How to Break In a New Pool Cue",
    "Cleaning and Maintaining Your Pool Cue",
    "How to Store a Pool Cue Properly",
    "Buying Your First Quality Pool Cue: What to Look For",
    "Two-Piece Cues vs One-Piece Cues for Serious Players",
    "Playing Snooker vs Pool: Key Differences",
    "How to Transition from Pool to Snooker",
    "Chinese 8-Ball: The World's Fastest Growing Cue Sport",
    "APA vs BCA Pool Leagues: Which Is Right for You?",
    "How to Sign Up for Local Pool Leagues and Tournaments",
    "Handicap Systems in Pool Leagues Explained",
    "How Professional Pool Players Practice",
    "Pool Tournaments: How to Prepare and What to Expect",
    "Double Elimination Brackets: Pool Tournament Format Explained",
    "Rack Technique: How to Rack a Tight, Legal 8-Ball Break",
    "How to Rack 9-Ball for a Perfect Diamond Rack",
    "The Magic Rack vs Traditional Rack: Pros and Cons",
    "How to Win at Billiards Bar Games",
    "Playing Pool for Money: Tips for Success",
    "Etiquette at the Pool Table: Unwritten Rules Every Player Knows",
    "How to Be a Good Pool Partner in Scotch Doubles",
]

CUE_TECHNIQUE_TOPICS = [
    "Bridge Hand Mastery: Building a Stable Platform for Every Shot",
    "How to Hold a Pool Cue Without Gripping Too Hard",
    "The Pendulum Stroke: Why It's the Secret to Consistent Pool",
    "Elbow Drop: The Key to a Straight Cue Stroke",
    "Follow-Through Technique: The Stroke Doesn't End at Contact",
    "Back Hand Grip Pressure: How Light Is Too Light?",
    "How to Align Your Body Correctly Before Every Shot",
    "Head Position During Your Pool Stroke: Where to Look",
    "Chin-on-Cue Technique: Pros and Cons",
    "How to Warm-Up Your Stroke Before Playing",
    "Common Grip Mistakes That Cause Inaccurate Shots",
    "Stroking Through the Cue Ball: What It Actually Means",
    "How to Stop Steering Your Pool Cue",
    "Bridge Length: How Far Should Your Bridge Be from the Cue Ball?",
    "Pause at the Back of the Stroke: Timing and Rhythm",
    "Backswing Length: How Far Back Should You Pull the Cue?",
    "Delivery Speed and Acceleration in the Pool Stroke",
    "How to Avoid Punching the Cue Ball",
    "Wrist Action in the Pool Stroke: Natural vs Rigid",
    "How to Hit Center Ball Every Time",
    "Top of Cue Ball vs Bottom: Hitting the Exact Spot",
    "The Feather Stroke: Practicing Touch Shots",
    "Shooting Around an Obstacle: Extended Bridge Techniques",
    "The Rail Bridge: Technique for Balls Close to the Cushion",
    "How to Shoot Over a Ball Without a Mechanical Bridge",
    "Elevated Cue Angle Shots: When and How",
    "How to Play a Controlled Masse Without Ripping the Cloth",
    "Understanding Tip Contact Point and Cue Ball Deflection",
    "English and Throw: Understanding Cue Ball-Object Ball Interaction",
    "Squirt and Deflection: How to Compensate Automatically",
    "Pivot Method for Low-Deflection Cues: A Step-by-Step Guide",
    "How to Develop a Consistent Pre-Shot Routine",
    "Practice Routines for a More Accurate Delivery",
    "The World 10-Ball Player's Stroke: What You Can Learn",
    "How to Copy the Stroke of Professional Pool Players",
    "Slow-Motion Analysis of a Perfect Pool Stroke",
    "How to Use a Tempo Stick to Improve Your Rhythm",
    "Dry Stroking: Why You Should Do It and How",
    "Playing in Rhythm: Tempo Drills for Pool",
    "How Breathing Affects Your Pool Stroke",
    "Relaxation Techniques for a Better Pool Stroke",
    "Shoulder Alignment: The Foundation Nobody Talks About",
    "Hip and Foot Stance for Lefties vs Righties",
    "How to Shoot Cross-Side Without Losing Accuracy",
    "The Closed Bridge for Extreme Shots",
    "Knuckle Bridge: An Alternative for Awkward Positions",
    "How to Shoot With Your Non-Dominant Hand",
    "Playing Off a Tight Rail: Body Mechanics",
    "Shooting Down the Length of the Table: Long Straight Shot Mechanics",
    "How to Stay Down on the Shot: Discipline and Practice",
]

SUCCESS_STORY_TOPICS = [
    "How I Improved My Pool Game in 90 Days With Daily Practice",
    "From Zero to League Champion: One Player's Journey",
    "How Playing Pool Changed My Discipline and Focus",
    "My First Pool Tournament: What I Learned Win or Lose",
    "How I Beat a Better Pool Player by Playing Smart",
    "The Day I Finally Understood Cue Ball Control",
    "How Pool Helped Me Build Confidence Off the Table",
    "From Bar Pool to Competitive Play: My Story",
    "How I Went From Breaking Racks to Running Racks",
    "The Practice Drill That Transformed My Game",
    "How I Learned to Control My Nerves at the Pool Table",
    "Teaching My Kid to Play Pool: A Parent's Guide",
    "How I Beat a Professional Pool Player for the First Time",
    "Pool as a Senior Sport: Why I Started Playing at 60",
    "How Pool Made Me a Better Problem Solver at Work",
    "Finding My Community at the Local Pool Hall",
    "How I Stopped Missing Easy Pool Shots",
    "The Moment I Realized Pool Is 80% Mental",
    "How Getting a Quality Pool Cue Changed My Whole Game",
    "From Plastic House Cue to Carbon Fiber: A Player's Transformation",
    "How I Upgraded My Equipment and Saw Immediate Results",
    "Playing Pool in Retirement: Health Benefits and Fun",
    "How Pool Tournaments Taught Me to Handle Pressure",
    "The Best Pool Lesson I Ever Got From a Stranger",
    "Why I Switched to a Low-Deflection Shaft and Never Looked Back",
    "How I Stopped Shanking Banks and Started Sinking Them",
    "My Journey From 3-Ball to 8-Ball Runouts",
    "How I Turned a Pool Hobby Into a Small Business",
    "Playing Pool With Parkinson's: My Adaptive Journey",
    "How Pool Helped Me Recover From a Sports Injury",
    "The Community of Pool: Why It's More Than Just a Game",
    "How I Used Pool to Stay Sharp in My 70s",
    "The Power of Mentorship in Pool: My Coach Changed Everything",
    "A Woman in a Men's Pool Hall: My Experience",
    "How Pool Brought Our Family Together on Game Night",
    "How I Finally Stopped Dogging the 8-Ball",
    "What Playing Pool Taught Me About Patience",
    "How I Improved My Pool Game Without a Coach",
    "My First Runout: What It Felt Like and How I Got There",
    "How Pool Helped Me Manage Stress and Anxiety",
    "Playing Pool Internationally: What I Learned Abroad",
    "How Pool League Transformed My Social Life",
    "The Best Pool Cue I Ever Owned: My Honest Review",
    "Why I Quit Cheap Cues and Invested in Quality",
    "How an Overcomer Pool Cue Upgraded My Precision",
    "Teaching Pool in Schools: My Experience as an Instructor",
    "How I Run a Weekly Pool Night at My Home",
    "The Life Lessons Pool Has Taught Me Over 20 Years",
    "From Casual Player to Certified Pool Instructor",
    "How Pool Became My Favorite Way to Disconnect From Screens",
]

# Merge for selection
ALL_TOPICS = [
    ("pool_tips", t) for t in POOL_TIPS_TOPICS
] + [
    ("cue_technique", t) for t in CUE_TECHNIQUE_TOPICS
] + [
    ("success_story", t) for t in SUCCESS_STORY_TOPICS
]

# ─────────────────────────────────────────────────────────────────────────────
# AUTHOR NAME POOLS
# ─────────────────────────────────────────────────────────────────────────────

FEMALE_FIRST_NAMES = [
    "Emma", "Olivia", "Sophia", "Isabella", "Ava", "Mia", "Charlotte", "Amelia",
    "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Avery", "Ella",
    "Scarlett", "Grace", "Chloe", "Victoria", "Riley", "Aria", "Lily", "Aubrey",
    "Zoey", "Penelope", "Luna", "Layla", "Nora", "Hannah", "Lillian", "Addison",
    "Camila", "Madison", "Eleanor", "Paisley", "Stella", "Violet", "Claire", "Savannah",
    "Audrey", "Bella", "Aurora", "Anna", "Samantha", "Caroline", "Genesis", "Aaliyah",
    "Kennedy", "Kinsley", "Allison", "Maya", "Sarah", "Natalie", "Leah", "Hailey",
    "Kylie", "Gabriella", "Brooklyn", "Peyton", "Taylor", "Alexa", "Naomi", "Elena",
]

MALE_FIRST_NAMES = [
    "Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas",
    "Henry", "Alexander", "Mason", "Michael", "Ethan", "Daniel", "Jacob", "Logan",
    "Jackson", "Sebastian", "Jack", "Aiden", "Owen", "Samuel", "Matthew", "Joseph",
    "Carter", "Wyatt", "John", "Owen", "Dylan", "Luke", "Gabriel", "Anthony",
    "Isaac", "Grayson", "Julian", "Levi", "Christopher", "Joshua", "Andrew", "Lincoln",
    "Ryan", "Nathan", "Aaron", "Adrian", "Christian", "Cameron", "Eli", "Ian",
    "Landon", "Connor", "Thomas", "Hunter", "Charles", "Austin", "Jordan", "Jason",
    "Caleb", "Tyler", "Kevin", "Brandon", "Adam", "Robert", "Eric", "Marcus",
]

LAST_NAMES = [
    "Anderson", "Bennett", "Brooks", "Campbell", "Carter", "Collins", "Cooper", "Davis",
    "Edwards", "Evans", "Foster", "Gray", "Green", "Hall", "Harris", "Hughes", "Jackson",
    "Johnson", "Jones", "Lewis", "Miller", "Mitchell", "Moore", "Morgan", "Murphy",
    "Nelson", "Parker", "Peterson", "Phillips", "Reed", "Reynolds", "Richardson",
    "Roberts", "Robinson", "Rogers", "Ross", "Russell", "Sanders", "Scott", "Smith",
    "Stewart", "Taylor", "Thomas", "Thompson", "Turner", "Walker", "Ward", "Watson",
    "White", "Williams", "Wilson", "Wood", "Wright", "Young", "Adams", "Baker", "Clark",
    "Garcia", "Martinez", "Rodriguez", "Hernandez", "Lopez", "Gonzalez", "Perez",
    "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Reyes", "Cruz",
    "Martin", "Bernard", "Simon", "Laurent", "Moreau", "Rossi", "Ferrari", "Bianchi",
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner",
]

POOL_OCCUPATIONS = [
    "Pool Coach",
    "Billiards Instructor",
    "Pool Hall Manager",
    "Competitive Pool Player",
    "Cue Sports Enthusiast",
    "Billiards Writer & Coach",
    "Pool League Organizer",
    "Professional Pool Player",
    "Recreational Pool Champion",
    "Cue Sports Analyst",
]

# ─────────────────────────────────────────────────────────────────────────────
# LLM INTERFACE
# ─────────────────────────────────────────────────────────────────────────────

PROMO_PRODUCT_SNIPPET = (
    "If you're serious about improving your pool game, equipment matters. "
    "The [Overcomer Pool Cue]({site_url}) is precision-crafted with a carbon fiber shaft "
    "and stainless steel joint, delivering consistent low-deflection performance for players "
    "who demand accuracy. Thousands of players have upgraded their game with Overcomer cues — "
    "check them out at {site_url}."
)


def build_article_prompt(category: str, topic: str, include_promo: bool) -> str:
    promo_instruction = ""
    if include_promo:
        promo_instruction = (
            "\n\n**PROMOTION (natural, not salesy):** Include a single natural paragraph "
            "somewhere in the article (not at the very end) that subtly recommends "
            f"the Overcomer Pool Cue from {SITE_URL}. Mention the carbon fiber shaft, "
            "stainless steel joint, and precision craftsmanship. Link text should read "
            f"'Overcomer Pool Cue' with the URL {SITE_URL}. Keep it helpful, not pushy."
        )

    category_context = {
        "pool_tips": "This is a pool tips and strategy article for players looking to improve their game.",
        "cue_technique": "This is a cue holding and stroke technique article focused on physical mechanics.",
        "success_story": "This is a first-person style success story or motivational article about pool.",
    }.get(category, "This is a pool and billiards article.")

    return f"""You are an expert pool and billiards writer creating SEO-optimized blog content for overcomerpoolcue.com.

{category_context}

**Article Title:** {topic}

**Requirements:**
- Minimum 1500 words (aim for 1600-1800 for competitive SEO)
- Use proper heading structure: one H1 (the title), multiple H2 subheadings, and H3 sub-sections where appropriate
- Write in clear, engaging, informative prose — not bullet-point-heavy
- Include actionable tips, real examples, and expert insights
- Naturally incorporate relevant keywords (pool cue, billiards, cue ball control, etc.)
- Write a compelling meta description (150-160 characters) at the very top labeled "META:" 
- Generate a clean URL slug labeled "SLUG:" (lowercase, hyphens, no special chars)
- Format the body in Markdown{promo_instruction}

**Output format (EXACTLY):**
META: <your 150-160 char meta description here>
SLUG: <url-slug-here>

# {topic}

<full article body in Markdown, 1500+ words>
"""


async def call_gemini(api_key: str, model_name: str, prompt: str) -> Optional[str]:
    """Call Gemini via SDK for a single key+model combination. Returns text or None."""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name,
            generation_config={"temperature": 0.7, "max_output_tokens": 4096},
        )
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: model.generate_content(prompt))
        return response.text.strip()
    except Exception as e:
        err = str(e)
        print(f"   ⚠️  Gemini key ...{api_key[-6:]} + {model_name}: {type(e).__name__}: {err[:300]}")
        return None


async def call_local_endpoint(prompt: str) -> Optional[str]:
    """Call the local/custom LLM endpoint fallback."""
    if not LLM_ENDPOINT:
        return None
    try:
        async with httpx.AsyncClient(timeout=660) as client:
            resp = await client.post(
                LLM_ENDPOINT,
                json={"prompt": prompt, "max_tokens": 4096},
                headers={"Content-Type": "application/json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                # Try common response shapes
                result = (
                    data.get("text")
                    or data.get("response")
                    or data.get("content")
                    or data.get("output")
                    or (data.get("choices") or [{}])[0].get("text")
                    or (data.get("choices") or [{}])[0].get("message", {}).get("content")
                )
                if not result:
                    print(f"   ⚠️  Local endpoint 200 but no recognized key. Response keys: {list(data.keys())}")
                    print(f"   ⚠️  Full response: {json.dumps(data)[:600]}")
                return result
            print(f"   ⚠️  Local endpoint returned HTTP {resp.status_code}")
            try:
                err_body = resp.json()
                print(f"   ⚠️  Local endpoint error body: {json.dumps(err_body, indent=2)[:600]}")
            except Exception:
                print(f"   ⚠️  Local endpoint raw response: {resp.text[:600]}")
            return None
    except Exception as e:
        print(f"   ⚠️  Local endpoint exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None


async def generate_text(prompt: str) -> Optional[str]:
    """
    Try every key × model combination, then fall back to local endpoint.
    Order: Key1+Model1 → Key1+Model2 → Key2+Model1 → Key2+Model2 → ...
    """
    for key_idx, key in enumerate(GEMINI_API_KEYS, 1):
        for model_name in GEMINI_MODELS:
            print(f"   🔑 Trying Gemini key #{key_idx} ({key[-6:]}) + {model_name}")
            result = await call_gemini(key, model_name, prompt)
            if result:
                print(f"   ✅ Success: key #{key_idx} + {model_name}")
                return result

    print(f"   🔄 All Gemini combinations failed, trying local endpoint: {LLM_ENDPOINT}")
    result = await call_local_endpoint(prompt)
    if result:
        print(f"   ✅ Local endpoint responded successfully")
        return result

    return None


async def generate_topic_from_llm() -> Optional[tuple[str, str]]:
    """Ask the LLM to suggest a fresh pool article topic. Returns (category, topic) or None."""
    prompt = (
        "You are a content strategist for a pool cue website (overcomerpoolcue.com). "
        "Suggest ONE highly specific, SEO-friendly blog article topic about pool playing, "
        "billiards technique, or pool cue equipment. "
        "Respond with ONLY a JSON object: "
        '{"category": "pool_tips|cue_technique|success_story", "topic": "The Article Title Here"}'
    )
    raw = await generate_text(prompt)
    if not raw:
        return None
    try:
        match = re.search(r'\{.*?"category".*?"topic".*?\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            cat = data.get("category", "pool_tips")
            if cat not in ("pool_tips", "cue_technique", "success_story"):
                cat = "pool_tips"
            return cat, data["topic"]
    except Exception:
        pass
    return None


# ─────────────────────────────────────────────────────────────────────────────
# ARTICLE PARSING
# ─────────────────────────────────────────────────────────────────────────────

def parse_article_output(raw: str, fallback_title: str) -> dict:
    """
    Parse LLM output into structured fields.
    Returns dict with keys: meta_description, slug, title, body
    """
    lines = raw.strip().splitlines()
    meta_description = ""
    slug = ""
    body_lines = []
    found_meta = False
    found_slug = False

    for line in lines:
        stripped = line.strip()
        if not found_meta and stripped.upper().startswith("META:"):
            meta_description = stripped[5:].strip()[:320]
            found_meta = True
            continue
        if not found_slug and stripped.upper().startswith("SLUG:"):
            slug = stripped[5:].strip()
            slug = re.sub(r"[^a-z0-9-]", "", slug.lower().replace(" ", "-"))
            found_slug = True
            continue
        body_lines.append(line)

    body = "\n".join(body_lines).strip()

    # Extract H1 as title if present
    title = fallback_title
    h1_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    if h1_match:
        title = h1_match.group(1).strip()

    # Ensure slug
    if not slug:
        slug = re.sub(r"[^a-z0-9-]", "", title.lower().replace(" ", "-"))
        slug = re.sub(r"-+", "-", slug).strip("-")

    # Word count check
    word_count = len(body.split())
    if word_count < 1000:
        print(f"   ⚠️  Article is only {word_count} words (expected 1500+)")
    else:
        print(f"   📝 Article word count: {word_count} words")

    return {
        "title": title,
        "slug": slug,
        "meta_description": meta_description,
        "body": body,
    }


def make_unique_slug(base_slug: str, existing_slugs: set[str]) -> str:
    """Append a random suffix if slug already exists."""
    slug = base_slug
    while slug in existing_slugs:
        slug = f"{base_slug}-{secrets.token_hex(3)}"
    return slug


# ─────────────────────────────────────────────────────────────────────────────
# UNSPLASH
# ─────────────────────────────────────────────────────────────────────────────

def extract_search_terms(title: str) -> str:
    """Extract meaningful keywords from article title for Unsplash query."""
    # Remove common stop words and keep pool-relevant keywords
    stop_words = {
        "how", "to", "a", "an", "the", "and", "or", "for", "in", "of",
        "on", "at", "by", "is", "are", "was", "were", "be", "been", "with",
        "from", "that", "this", "your", "my", "our", "every", "when",
        "what", "why", "which", "should", "you", "do", "can", "vs",
        "about", "into", "through", "without", "during",
    }
    words = re.sub(r"[^a-zA-Z\s]", "", title.lower()).split()
    keywords = [w for w in words if w not in stop_words and len(w) > 2]

    # Always append billiards for relevance
    base = " ".join(keywords[:4])
    return f"{base} billiards pool cue"


async def fetch_unsplash_image(title: str) -> Optional[str]:
    """Fetch a relevant image URL from Unsplash matching the article title."""
    if not UNSPLASH_ACCESS_KEY:
        print("   ⚠️  UNSPLASH_ACCESS_KEY not set, skipping image fetch")
        return None

    # Try progressively broader queries until we get a result
    title_query = extract_search_terms(title)
    queries_to_try = [
        title_query,
        "billiards pool cue table",
        "pool billiards game",
    ]

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            for query in queries_to_try:
                print(f"   🔍 Unsplash query: '{query}'")
                resp = await client.get(
                    "https://api.unsplash.com/search/photos",
                    params={
                        "query": query,
                        "per_page": 10,
                        "orientation": "landscape",
                        "content_filter": "high",
                    },
                    headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
                )
                if resp.status_code != 200:
                    print(f"   ⚠️  Unsplash returned HTTP {resp.status_code}")
                    return None

                results = resp.json().get("results", [])
                if results:
                    photo = random.choice(results[:5])
                    url = photo["urls"]["regular"]
                    print(f"   🖼️  Image found: {url[:60]}...")
                    return url

                print(f"   ⚠️  No results for '{query}', trying broader query...")

            print("   ⚠️  All Unsplash queries exhausted")
            return None

    except Exception as e:
        print(f"   ⚠️  Unsplash fetch error: {e}")
        return None


# ─────────────────────────────────────────────────────────────────────────────
# DATABASE OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

async def get_or_create_article_bot() -> int:
    """Get or create the article_bot user. Returns user ID."""
    async with async_session_maker() as db:
        result = await db.execute(
            select(User).where(User.username == ARTICLE_BOT_USERNAME)
        )
        bot = result.scalar_one_or_none()
        if bot:
            return bot.id

        print(f"   🤖 Creating article_bot user...")
        bot = User(
            username=ARTICLE_BOT_USERNAME,
            email=f"{ARTICLE_BOT_USERNAME}@overcomerpoolcue.internal",
            hashed_password=get_password_hash(ARTICLE_BOT_PASSWORD),
            is_active=False,
        )
        db.add(bot)
        await db.commit()
        await db.refresh(bot)
        print(f"   ✅ article_bot created (ID: {bot.id})")
        return bot.id


async def publish_article(
    bot_id: int,
    title: str,
    slug: str,
    body: str,
    meta_description: str,
    category: str,
) -> Optional[int]:
    """Insert the blog post as article_bot. Returns post ID or None."""
    try:
        async with async_session_maker() as db:
            # Check slug uniqueness
            result = await db.execute(select(BlogPost.slug))
            existing_slugs = {row[0] for row in result}
            unique_slug = make_unique_slug(slug, existing_slugs)

            post = BlogPost(
                title=title,
                slug=unique_slug,
                body=body,
                meta_description=meta_description,
                category=category,
                author_id=bot_id,
                is_published=True,
            )
            db.add(post)
            await db.commit()
            await db.refresh(post)
            print(f"   ✅ Post published: [ID {post.id}] '{title[:60]}'")
            return post.id

    except Exception as e:
        print(f"   ❌ Error publishing post: {e}")
        import traceback
        traceback.print_exc()
        return None


async def inject_featured_image(post_id: int, title: str) -> bool:
    """Fetch and inject a featured image for the given post."""
    image_url = await fetch_unsplash_image(title)
    if not image_url:
        return False

    try:
        async with async_session_maker() as db:
            result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
            post = result.scalar_one_or_none()
            if not post:
                print(f"   ⚠️  Post ID {post_id} not found for image injection")
                return False
            post.featured_image = image_url
            await db.commit()
            print(f"   ✅ Featured image injected")
            return True
    except Exception as e:
        print(f"   ❌ Error injecting image: {e}")
        return False


async def create_fake_author(db) -> Optional[int]:
    """Create a deactivated fake human author. Returns user ID or None."""
    try:
        is_female = random.random() < 0.6
        first_name = random.choice(FEMALE_FIRST_NAMES if is_female else MALE_FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        gender = "female" if is_female else "male"
        occupation = random.choice(POOL_OCCUPATIONS)

        username = f"{first_name.lower()}_{last_name.lower()}_{random.randint(1000, 9999)}"
        email = f"{username}@overcomerpoolcue-author.internal"

        print(f"   👤 Creating author: {first_name} {last_name} ({gender}, {occupation})")

        user = User(
            username=username,
            email=email,
            hashed_password=get_password_hash(secrets.token_urlsafe(24)),
            is_active=False,
        )
        db.add(user)
        await db.flush()

        profile = Profile(
            user_id=user.id,
            first_name=first_name,
            last_name=last_name,
            age=random.randint(28, 45),
            gender=gender,
            location=random.choice([
                "New York, NY", "Los Angeles, CA", "Houston, TX",
                "Chicago, IL", "Phoenix, AZ", "Dallas, TX",
                "San Antonio, TX", "San Diego, CA", "Austin, TX",
                "Las Vegas, NV",
            ]),
            bio=(
                f"{first_name} {last_name} is a {occupation.lower()} with over "
                f"{random.randint(8, 20)} years of experience in competitive pool and billiards. "
                f"Passionate about helping players at all levels improve their game."
            ),
            occupation=occupation,
            education=random.choice([
                "Bachelor's in Physical Education",
                "Certified Billiards Instructor",
                "Self-Taught — 15+ Years Competition",
                "APA Master Certified Coach",
                "BCA Certified Instructor",
            ]),
        )
        db.add(profile)
        await db.flush()
        print(f"   ✅ Author created: {first_name} {last_name} (ID: {user.id})")
        return user.id

    except Exception as e:
        print(f"   ❌ Error creating author: {e}")
        import traceback
        traceback.print_exc()
        return None


async def reassign_author(post_id: int) -> bool:
    """Replace article_bot with a new fake human author on the given post."""
    try:
        async with async_session_maker() as db:
            result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
            post = result.scalar_one_or_none()
            if not post:
                print(f"   ⚠️  Post ID {post_id} not found for author reassignment")
                return False

            new_author_id = await create_fake_author(db)
            if not new_author_id:
                return False

            original_created_at = post.created_at
            post.author_id = new_author_id
            # Preserve original publication timestamp
            post.created_at = original_created_at

            await db.commit()
            print(f"   ✅ Author reassigned (created_at preserved: {original_created_at})")
            return True

    except Exception as e:
        print(f"   ❌ Error reassigning author: {e}")
        import traceback
        traceback.print_exc()
        return False


# ─────────────────────────────────────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────────────────────────────────────

async def run_pipeline():
    """Execute one full article generation cycle."""
    print()
    print("=" * 65)
    print(f"  🎱 OVERCOMER POOL CUE — ARTICLE GENERATOR")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 65)

    # ── Step 0: Ensure article_bot exists ──────────────────────────────────
    print("\n[0/5] Ensuring article_bot account exists...")
    bot_id = await get_or_create_article_bot()

    # ── Step 1: Select topic ───────────────────────────────────────────────
    print("\n[1/5] Selecting topic...")
    # 10% chance: ask LLM for a fresh topic idea
    if random.random() < 0.10:
        print("   💡 Asking LLM to suggest a topic...")
        llm_topic = await generate_topic_from_llm()
        if llm_topic:
            category, topic = llm_topic
            print(f"   🎯 LLM suggested: [{category}] {topic}")
        else:
            category, topic = random.choice(ALL_TOPICS)
            print(f"   🎯 LLM failed, using preset: [{category}] {topic}")
    else:
        category, topic = random.choice(ALL_TOPICS)
        print(f"   🎯 Selected: [{category}] {topic}")

    # 20% chance: include product promotion
    include_promo = random.random() < 0.20
    if include_promo:
        print(f"   💰 This article will include a product promotion")

    # ── Step 2: Generate article ───────────────────────────────────────────
    print("\n[2/5] Generating article content via LLM...")
    prompt = build_article_prompt(category, topic, include_promo)
    raw_output = await generate_text(prompt)

    if not raw_output:
        print("   ❌ LLM generation failed. Aborting pipeline.")
        return False

    article = parse_article_output(raw_output, topic)
    print(f"   📄 Title:  {article['title']}")
    print(f"   🔗 Slug:   {article['slug']}")
    print(f"   📝 Meta:   {article['meta_description'][:80]}...")

    # ── Step 3: Publish to database ────────────────────────────────────────
    print("\n[3/5] Publishing article to database...")
    post_id = await publish_article(
        bot_id=bot_id,
        title=article["title"],
        slug=article["slug"],
        body=article["body"],
        meta_description=article["meta_description"],
        category=category,
    )
    if not post_id:
        print("   ❌ Failed to publish article. Aborting pipeline.")
        return False

    # ── Step 4: Fetch & inject featured image ──────────────────────────────
    print("\n[4/5] Fetching featured image from Unsplash...")
    image_success = await inject_featured_image(post_id, article["title"])
    if not image_success:
        print("   ⚠️  Featured image step failed (post is live without image)")

    # ── Step 5: Assign human author ────────────────────────────────────────
    print("\n[5/5] Assigning fake human author...")
    author_success = await reassign_author(post_id)
    if not author_success:
        print("   ⚠️  Author reassignment failed (article_bot remains as author)")

    # ── Summary ────────────────────────────────────────────────────────────
    print()
    print("=" * 65)
    if image_success and author_success:
        print("  ✅ PIPELINE COMPLETE — Article, image, and author all set")
    elif image_success:
        print("  ⚠️  PARTIAL — Article + image OK, author assignment failed")
    elif author_success:
        print("  ⚠️  PARTIAL — Article + author OK, image fetch failed")
    else:
        print("  ⚠️  ARTICLE PUBLISHED — Image and author steps failed")
    print(f"  🔗 Slug: /blog/{article['slug']}")
    print("=" * 65)
    return True


# ─────────────────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

async def main_async(args):
    # Initialize DB tables
    await init_db()

    if args.test:
        print("🧪 Test mode: Running pipeline once")
        await run_pipeline()
    else:
        interval_seconds = args.interval * 3600
        print(f"🔄 Continuous mode: Generating one article every {args.interval} hour(s)")
        while True:
            await run_pipeline()
            print(f"\n⏰ Next article in {args.interval} hour(s)...")
            await asyncio.sleep(interval_seconds)


def main():
    parser = argparse.ArgumentParser(description="Overcomer Pool Cue — SEO Article Generator")
    parser.add_argument("--test", action="store_true", help="Generate one article and exit")
    parser.add_argument(
        "--interval",
        type=int,
        default=int(os.getenv("ARTICLE_INTERVAL_HOURS", "24")),
        help="Hours between article generation runs (default: 24)",
    )
    args = parser.parse_args()

    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
