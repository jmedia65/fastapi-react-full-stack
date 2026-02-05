"""
=============================================================================
DATABASE.PY - Data Storage Layer
=============================================================================

This is a SIMPLIFIED in-memory database for learning purposes.
Data is stored in Python dictionaries and LOST when the server restarts.

IN PRODUCTION, you would replace this with:
- PostgreSQL + SQLAlchemy (most common)
- MongoDB + Motor (for document databases)
- SQLite (for small apps or prototyping)

WHY SEPARATE THIS FILE?
This is the "Repository Pattern" - isolating data access:
1. Routers don't know HOW data is stored (dict? SQL? MongoDB?)
2. You can swap databases without changing router code
3. Easier to test - mock the database in tests

PATTERN: In production, this would be a class like:
    class UserRepository:
        def get_all(self) -> list[User]: ...
        def get_by_id(self, id: int) -> User | None: ...
        def create(self, user: UserCreate) -> User: ...
        def update(self, id: int, user: UserCreate) -> User: ...
        def delete(self, id: int) -> bool: ...
=============================================================================
"""

# -----------------------------------------------------------------------------
# IN-MEMORY "DATABASE"
# -----------------------------------------------------------------------------
# users_db: Dictionary storing users, keyed by user ID
# Structure: { 1: {"id": 1, "name": "John", "email": "john@example.com"}, ... }
#
# Type hint dict[int, dict] means:
#   - Keys are integers (user IDs)
#   - Values are dictionaries (user data)
users_db: dict[int, dict] = {}

# user_id_counter: Auto-incrementing ID generator
# In SQL databases, this is handled by AUTO_INCREMENT or SERIAL
# Every time we create a user, we increment this
user_id_counter = 1
