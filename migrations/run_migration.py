"""Database migration runner for Phase III

Run a single SQL migration file against the database.
Usage: python run_migration.py <migration_file.sql>
"""
import sys
import os
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in environment variables")
    print("Please create backend/.env file with DATABASE_URL")
    sys.exit(1)


def run_migration(migration_file: str):
    """Run a SQL migration file"""
    migration_path = Path(__file__).parent / migration_file

    if not migration_path.exists():
        print(f"ERROR: Migration file not found: {migration_file}")
        sys.exit(1)

    print(f"Running migration: {migration_file}")
    print(f"Database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'local'}")

    # Read migration SQL
    with open(migration_path, 'r') as f:
        sql = f.read()

    # Execute migration
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Execute the SQL
        cursor.execute(sql)
        conn.commit()

        print(f"✅ Migration {migration_file} completed successfully")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_migration.py <migration_file.sql>")
        print("\nAvailable migrations:")
        migrations_dir = Path(__file__).parent
        for sql_file in sorted(migrations_dir.glob("*.sql")):
            print(f"  - {sql_file.name}")
        sys.exit(1)

    migration_file = sys.argv[1]
    run_migration(migration_file)
