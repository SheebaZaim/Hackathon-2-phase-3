"""MCP Tool: add_task - Create a new task

Contract: specs/001-constitution-alignment/contracts/add-task-tool.yaml
Constitution: Stateless tool, no direct database access
"""
import re
from typing import Dict, Optional
from sqlmodel import Session
from datetime import datetime, timedelta

from ...models.task import Task
from ...database.connection import get_session


# Month name → number mapping
MONTH_MAP = {
    "january": 1, "jan": 1,
    "february": 2, "feb": 2,
    "march": 3, "mar": 3,
    "april": 4, "apr": 4,
    "may": 5,
    "june": 6, "jun": 6,
    "july": 7, "jul": 7,
    "august": 8, "aug": 8,
    "september": 9, "sep": 9, "sept": 9,
    "october": 10, "oct": 10,
    "november": 11, "nov": 11,
    "december": 12, "dec": 12,
}

# Day name → offset from today
DAY_MAP = {
    "monday": 0, "tuesday": 1, "wednesday": 2,
    "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6
}

# Priority keyword detection
HIGH_PRIORITY_WORDS = [
    "urgent", "urgently", "asap", "immediately", "critical", "important",
    "high priority", "top priority", "must do", "deadline", "rush"
]
LOW_PRIORITY_WORDS = [
    "low priority", "someday", "whenever", "eventually", "no rush",
    "not urgent", "optional", "if possible", "maybe", "low"
]

# Category keyword detection
CATEGORY_MAP = {
    "school": ["school", "class", "lecture", "syllabus", "assignment", "homework",
                "exam", "test", "quiz", "study", "university", "college", "course",
                "semester", "professor", "student"],
    "work": ["work", "office", "meeting", "client", "project", "report", "deadline",
              "manager", "team", "presentation", "business", "corporate", "job",
              "email", "conference", "review", "marriott"],
    "shopping": ["buy", "purchase", "shop", "grocery", "groceries", "store", "order",
                  "get", "pick up", "market", "mall"],
    "health": ["doctor", "hospital", "medicine", "appointment", "gym", "exercise",
                "workout", "health", "medical", "dentist", "pharmacy", "clinic"],
    "personal": ["birthday", "family", "home", "house", "clean", "dinner", "lunch",
                  "call", "visit", "personal", "friend", "party"],
    "finance": ["pay", "bill", "bank", "money", "invoice", "tax", "payment",
                 "budget", "salary", "expense"],
}


def _extract_priority(text: str) -> Optional[str]:
    """Detect priority level from keywords in the text."""
    lower = text.lower()
    for kw in HIGH_PRIORITY_WORDS:
        if kw in lower:
            return "high"
    for kw in LOW_PRIORITY_WORDS:
        if kw in lower:
            return "low"
    return None


def _extract_category(text: str) -> Optional[str]:
    """Detect category from keywords in the text."""
    lower = text.lower()
    for category, keywords in CATEGORY_MAP.items():
        for kw in keywords:
            if kw in lower:
                return category
    return None


def _extract_date_from_title(title: str, today: datetime) -> tuple[str, Optional[str]]:
    """
    Extract a due date from the task title text and return (clean_title, due_date_mm_dd_yyyy).
    Removes the date phrase from the title.
    """
    text = title.strip()
    found_date = None
    clean_title = text

    # Pattern: "on 24 February", "on February 24", "on 24 Feb"
    match = re.search(
        r'\bon\s+(\d{1,2})\s+(' + '|'.join(MONTH_MAP.keys()) + r')\b',
        text, re.IGNORECASE
    )
    if not match:
        match = re.search(
            r'\bon\s+(' + '|'.join(MONTH_MAP.keys()) + r')\s+(\d{1,2})\b',
            text, re.IGNORECASE
        )
        if match:
            month_str, day_str = match.group(1), match.group(2)
        else:
            match = None
    else:
        day_str, month_str = match.group(1), match.group(2)

    if match:
        month = MONTH_MAP[month_str.lower()]
        day = int(day_str)
        year = today.year if month >= today.month else today.year + 1
        found_date = f"{month:02d}/{day:02d}/{year}"
        clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()

    # Pattern: "by 24 February" / "by February 24"
    if not found_date:
        match = re.search(
            r'\bby\s+(\d{1,2})\s+(' + '|'.join(MONTH_MAP.keys()) + r')\b',
            text, re.IGNORECASE
        )
        if not match:
            match = re.search(
                r'\bby\s+(' + '|'.join(MONTH_MAP.keys()) + r')\s+(\d{1,2})\b',
                text, re.IGNORECASE
            )
            if match:
                month_str, day_str = match.group(1), match.group(2)
            else:
                match = None
        else:
            day_str, month_str = match.group(1), match.group(2)

        if match:
            month = MONTH_MAP[month_str.lower()]
            day = int(day_str)
            year = today.year if month >= today.month else today.year + 1
            found_date = f"{month:02d}/{day:02d}/{year}"
            clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()

    # Pattern: "tomorrow"
    if not found_date and re.search(r'\btomorrow\b', text, re.IGNORECASE):
        d = today + timedelta(days=1)
        found_date = f"{d.month:02d}/{d.day:02d}/{d.year}"
        clean_title = re.sub(r'\btomorrow\b', '', text, flags=re.IGNORECASE).strip().strip(',').strip()

    # Pattern: "today"
    if not found_date and re.search(r'\btoday\b', text, re.IGNORECASE):
        found_date = f"{today.month:02d}/{today.day:02d}/{today.year}"
        clean_title = re.sub(r'\btoday\b', '', text, flags=re.IGNORECASE).strip().strip(',').strip()

    # Pattern: "next Monday/Tuesday/..."
    if not found_date:
        match = re.search(r'\bnext\s+(' + '|'.join(DAY_MAP.keys()) + r')\b', text, re.IGNORECASE)
        if match:
            target_day = DAY_MAP[match.group(1).lower()]
            current_day = today.weekday()
            days_ahead = (target_day - current_day) % 7 or 7
            d = today + timedelta(days=days_ahead)
            found_date = f"{d.month:02d}/{d.day:02d}/{d.year}"
            clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()

    # Pattern: "in X days"
    if not found_date:
        match = re.search(r'\bin\s+(\d+)\s+days?\b', text, re.IGNORECASE)
        if match:
            d = today + timedelta(days=int(match.group(1)))
            found_date = f"{d.month:02d}/{d.day:02d}/{d.year}"
            clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()

    # Pattern: MM/DD/YYYY already in title
    if not found_date:
        match = re.search(r'\b(\d{2}/\d{2}/\d{4})\b', text)
        if match:
            found_date = match.group(1)
            clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()

    # Pattern: YYYY-MM-DD already in title
    if not found_date:
        match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', text)
        if match:
            try:
                d = datetime.strptime(match.group(1), "%Y-%m-%d")
                found_date = f"{d.month:02d}/{d.day:02d}/{d.year}"
                clean_title = (text[:match.start()] + text[match.end():]).strip().strip(',').strip()
            except ValueError:
                pass

    # Clean up extra spaces
    clean_title = re.sub(r'\s+', ' ', clean_title).strip()
    if not clean_title:
        clean_title = text  # fallback to original if cleaning removed everything

    return clean_title, found_date


async def add_task(
    user_id: str,
    title: str,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    category: Optional[str] = None,
    session: Session = None
) -> Dict:
    """
    Create a new task for the user.

    MCP Tool Implementation per contract specification.
    This tool is STATELESS - no session state maintained.

    Args:
        user_id (str): ID of the user creating the task
        title (str): Title/name of the task (1-255 characters)
        description (str, optional): Detailed description of the task
        priority (str, optional): Priority level - 'low', 'medium', or 'high'
        due_date (str, optional): Due date in MM/DD/YYYY format
        category (str, optional): Task category label

    Returns:
        Dict: {"task_id": int, "status": "created", "title": str}
    """
    if not title or len(title.strip()) == 0:
        raise ValueError("Title cannot be empty")
    if len(title) > 255:
        raise ValueError("Title cannot exceed 255 characters")
    if not user_id or len(user_id.strip()) == 0:
        raise ValueError("User ID is required")

    today = datetime.utcnow()
    original_title = title.strip()

    # Server-side: extract due date from title if AI didn't parse it
    clean_title, extracted_date = _extract_date_from_title(original_title, today)
    if not due_date and extracted_date:
        due_date = extracted_date
        title = clean_title

    # Server-side: extract priority from sentence if AI didn't set it
    if not priority or priority == "medium":
        detected_priority = _extract_priority(original_title)
        if detected_priority:
            priority = detected_priority

    # Server-side: extract category from sentence if AI didn't set it
    if not category:
        detected_category = _extract_category(original_title)
        if detected_category:
            category = detected_category

    # Normalize priority
    valid_priorities = {"low", "medium", "high"}
    if priority and priority.lower() in valid_priorities:
        priority = priority.lower()
    else:
        priority = "medium"

    task = Task(
        user_id=user_id,
        title=title.strip(),
        description=description.strip() if description else None,
        priority=priority,
        due_date=due_date,
        category=category.strip() if category else None,
        completed=False,
        created_at=today,
        updated_at=today
    )

    if session is None:
        session = next(get_session())

    session.add(task)
    session.commit()
    session.refresh(task)

    return {
        "task_id": task.id,
        "status": "created",
        "title": task.title
    }


# MCP Tool Schema for OpenAI function calling
ADD_TASK_SCHEMA = {
    "type": "function",
    "function": {
        "name": "add_task",
        "description": "Create a new task for the user. Extract the task title, description, priority, due date, and category from the user's message.",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "ID of the user creating the task (use the authenticated user's ID)"
                },
                "title": {
                    "type": "string",
                    "description": "Short title/name of the task only. Do NOT include date or priority info here."
                },
                "description": {
                    "type": "string",
                    "description": "Optional longer description or notes about the task"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "Priority level: 'high' for urgent, 'medium' for normal, 'low' for someday. Default is 'medium'."
                },
                "due_date": {
                    "type": "string",
                    "description": "Due date in MM/DD/YYYY format. Convert natural language: 'tomorrow'→next day, '24 February'→02/24/2026, 'next Friday'→calculate. Today is 02/17/2026."
                },
                "category": {
                    "type": "string",
                    "description": "Optional category tag (e.g. 'work', 'personal', 'shopping', 'school')"
                }
            },
            "required": ["user_id", "title"]
        }
    }
}
