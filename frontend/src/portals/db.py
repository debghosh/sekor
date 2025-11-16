import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

# Get the directory where db.py is located
current_dir = Path(__file__).parent

# Load .env from the same directory as db.py
env_path = current_dir / '.env'
load_dotenv(dotenv_path=env_path)

def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    
    # Debug: print to verify it's loaded
    if not database_url:
        raise ValueError("DATABASE_URL not found in .env file!")
    
    print(f"Connecting to: {database_url[:30]}...")  # Print first 30 chars for debugging
    
    return psycopg2.connect(database_url)

