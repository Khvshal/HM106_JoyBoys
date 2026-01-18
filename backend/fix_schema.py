import sqlite3
import os

DB_PATH = "hackmatrix.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found!")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # 1. Add fact_opinion_ratio to articles
        print("Checking articles table...")
        try:
            cursor.execute("ALTER TABLE articles ADD COLUMN fact_opinion_ratio FLOAT DEFAULT 0.5")
            print("✅ Added fact_opinion_ratio to articles")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ fact_opinion_ratio already exists")
            else:
                print(f"⚠️ Error adding fact_opinion_ratio: {e}")

    except Exception as e:
        print(f"Error checking articles: {e}")

    try:
        # 2. Add upvotes/downvotes to comments
        print("Checking comments table...")
        try:
            cursor.execute("ALTER TABLE comments ADD COLUMN upvotes INTEGER DEFAULT 0")
            print("✅ Added upvotes to comments")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ upvotes already exists")
            else:
                print(f"⚠️ Error adding upvotes: {e}")

        try:
            cursor.execute("ALTER TABLE comments ADD COLUMN downvotes INTEGER DEFAULT 0")
            print("✅ Added downvotes to comments")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ downvotes already exists")
            else:
                print(f"⚠️ Error adding downvotes: {e}")

    except Exception as e:
        print(f"Error checking comments: {e}")

    try:
        # 3. Add ip_address to ratings
        print("Checking ratings table...")
        try:
            cursor.execute("ALTER TABLE ratings ADD COLUMN ip_address VARCHAR(45)")
            print("✅ Added ip_address to ratings")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ ip_address already exists in ratings")
            else:
                print(f"⚠️ Error adding ip_address to ratings: {e}")
                
        # 4. Add ip_address to comment_votes
        print("Checking comment_votes table...")
        try:
            cursor.execute("ALTER TABLE comment_votes ADD COLUMN ip_address VARCHAR(45)")
            print("✅ Added ip_address to comment_votes")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ ip_address already exists in comment_votes")
            else:
                print(f"⚠️ Error adding ip_address to comment_votes: {e}")

    except Exception as e:
        print(f"Error checking ratings/votes: {e}")

    except Exception as e:
        print(f"Error checking ratings/votes: {e}")

    try:
        # 5. Add ip_address to comments
        print("Checking comments table for IP...")
        try:
            cursor.execute("ALTER TABLE comments ADD COLUMN ip_address VARCHAR(45)")
            print("✅ Added ip_address to comments")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e):
                print("ℹ️ ip_address already exists in comments")
            else:
                print(f"⚠️ Error adding ip_address to comments: {e}")

    except Exception as e:
        print(f"Error checking comments IP: {e}")

    conn.commit()
    # Add category to articles
    try:
        print("Adding category column to articles table...")
        cursor.execute("ALTER TABLE articles ADD COLUMN category VARCHAR(50) DEFAULT 'General'")
        conn.commit()
        print("Added category column successfully.")
    except Exception as e:
        print(f"Skipping category column (might exist): {e}")
        conn.rollback()

    conn.close()
    print("Migration check complete.")

if __name__ == "__main__":
    migrate()
