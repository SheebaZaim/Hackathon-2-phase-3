"""Conversation Service - Archival and Management Logic

Handles conversation lifecycle including archival after 90 days or 1000 messages.
"""
from sqlmodel import Session, select, func
from datetime import datetime, timedelta
from typing import List

from ..models.conversation import Conversation
from ..models.message import Message


class ConversationService:
    """Service for conversation management and archival"""

    @staticmethod
    async def archive_old_conversations(session: Session) -> int:
        """
        Archive conversations that meet archival criteria:
        - Older than 90 days from last update, OR
        - Have 1000+ messages

        Args:
            session: Database session

        Returns:
            int: Number of conversations archived
        """
        # Calculate cutoff date (90 days ago)
        cutoff_date = datetime.utcnow() - timedelta(days=90)

        # Find conversations to archive
        # Criteria 1: Last updated > 90 days ago
        old_convs_statement = select(Conversation).where(
            Conversation.updated_at < cutoff_date
        )

        # Criteria 2: Message count >= 1000
        high_msg_statement = (
            select(Conversation.id)
            .join(Message, Message.conversation_id == Conversation.id)
            .group_by(Conversation.id)
            .having(func.count(Message.id) >= 1000)
        )

        # Get conversation IDs to archive
        old_conversations = session.exec(old_convs_statement).all()
        high_msg_conv_ids = session.exec(high_msg_statement).all()

        # Combine both sets
        conversations_to_archive = set([c.id for c in old_conversations])
        conversations_to_archive.update(high_msg_conv_ids)

        # For now, archival means adding a flag (we could move to archive table)
        # In production, we'd:
        # 1. Move to archive storage (S3, cold storage DB)
        # 2. Delete from active tables
        # 3. Log archival action

        # Placeholder: Just log what would be archived
        if conversations_to_archive:
            print(f"[ARCHIVAL] Would archive {len(conversations_to_archive)} conversations")
            # In production: Implement actual archival logic here

        return len(conversations_to_archive)

    @staticmethod
    async def check_message_limit(conversation_id: int, session: Session) -> bool:
        """
        Check if conversation has reached message limit (1000 messages).

        Args:
            conversation_id: Conversation ID to check
            session: Database session

        Returns:
            bool: True if limit reached, False otherwise
        """
        statement = (
            select(func.count(Message.id))
            .where(Message.conversation_id == conversation_id)
        )

        result = session.exec(statement).first()
        message_count = result or 0

        return message_count >= 1000

    @staticmethod
    async def get_user_conversation_count(user_id: str, session: Session) -> int:
        """
        Get total number of active conversations for a user.

        Args:
            user_id: User ID
            session: Database session

        Returns:
            int: Number of active conversations
        """
        statement = select(func.count(Conversation.id)).where(
            Conversation.user_id == user_id
        )

        result = session.exec(statement).first()
        return result or 0
