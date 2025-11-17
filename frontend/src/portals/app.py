import streamlit as st
from datetime import datetime
import pandas as pd
from db import get_db_connection
import os

st.set_page_config(
    page_title="Admin Portal",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# EXACT prototype CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Global */
    * {
        font-family: 'Inter', -apple-system, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    /* Hide Streamlit */
    #MainMenu, footer, header {visibility: hidden;}
    .stDeployButton {display: none;}
    
    /* App background */
    .stApp {
        background: #f8f9fa;
    }
    
    /* Remove ALL default Streamlit padding */
    .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    section.main > div {
        padding: 0 !important;
    }
    
    /* Header */
    .portal-header {
        background: white;
        padding: 20px 40px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
    }
    
    .portal-header h1 {
        color: #dc2626;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
    }
    
    .user-badge {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .user-avatar {
        width: 36px;
        height: 36px;
        background: #dc2626;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
    }
    
    .user-name {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        line-height: 1.2;
    }
    
    .user-role {
        font-size: 11px;
        color: #6b7280;
        line-height: 1.2;
    }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background: white;
        border-right: 1px solid #e5e7eb;
    }
    
    [data-testid="stSidebar"] > div:first-child {
        background: white;
        padding: 0;
    }
    
    /* Main content wrapper */
    .dashboard-container {
        padding: 32px 40px;
        background: #f8f9fa;
    }
    
    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
        margin-bottom: 32px;
    }
    
    .stat-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 24px 20px;
        text-align: center;
    }
    
    .stat-label {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #9ca3af;
        margin-bottom: 12px;
        display: block;
    }
    
    .stat-value {
        font-size: 36px;
        font-weight: 700;
        color: #111827;
        line-height: 1;
    }
    
    .stat-value.green { color: #10b981; }
    .stat-value.yellow { color: #f59e0b; }
    .stat-value.purple { color: #8b5cf6; }
    .stat-value.blue { color: #3b82f6; }
    
    /* Content Grid */
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    
    .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 28px;
    }
    
    .card h3 {
        font-size: 17px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 24px 0;
    }
    
    /* Article Item */
    .article-item {
        padding: 16px 0;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .article-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    
    .article-item:first-child {
        padding-top: 0;
    }
    
    .article-content {
        flex: 1;
    }
    
    .article-title {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 6px 0;
        line-height: 1.4;
    }
    
    .article-meta {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.3;
    }
    
    /* Badge */
    .badge {
        display: inline-block;
        padding: 5px 12px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
    }
    
    .badge-published {
        background: #d1fae5;
        color: #065f46;
    }
    
    .badge-pending {
        background: #FFF9C4;
        color: #F57F17;
    }
    
    /* Top Item */
    .top-item {
        padding: 16px 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .top-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    
    .top-item:first-child {
        padding-top: 0;
    }
    
    .top-title {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 6px 0;
        line-height: 1.4;
    }
    
    .top-stats {
        font-size: 12px;
        color: #6b7280;
    }
    
    .dot-red {
        color: #ef4444;
        font-weight: 600;
    }
    
    .comment-blue {
        color: #3b82f6;
    }
    
    /* Remove streamlit button styling */
    .stButton button {
        width: 100%;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
        background: white;
        color: #374151;
        font-weight: 500;
        padding: 8px 12px;
        font-size: 14px;
    }
    
    .stButton button:hover {
        background: #f9fafb;
        border-color: #d1d5db;
    }
    
    /* Hide extra whitespace */
    .element-container {
        margin: 0 !important;
        padding: 0 !important;
    }
</style>
""", unsafe_allow_html=True)

def check_auth():
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    
    if not st.session_state.authenticated:
        col1, col2, col3 = st.columns([1, 1, 1])
        with col2:
            st.markdown("""
            <div style='background: white; padding: 48px; border-radius: 12px; margin-top: 100px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);'>
                <h1 style='color: #dc2626; text-align: center; margin-bottom: 32px; font-size: 24px;'>Admin Portal</h1>
            """, unsafe_allow_html=True)
            
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            
            if st.button("Login", use_container_width=True):
                if username == os.getenv("ADMIN_USERNAME", "admin") and password == os.getenv("ADMIN_PASSWORD", "admin123"):
                    st.session_state.authenticated = True
                    st.rerun()
                else:
                    st.error("Invalid credentials")
            
            st.markdown("</div>", unsafe_allow_html=True)
        st.stop()

check_auth()

# Header
st.markdown("""
<div class='portal-header'>
    <h1>Admin Portal</h1>
    <div class='user-badge'>
        <div class='user-avatar'>A</div>
        <div>
            <div class='user-name'>admin</div>
            <div class='user-role'>Administrator</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    if 'page' not in st.session_state:
        st.session_state.page = "Dashboard"
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    if st.button("📊 Dashboard", key="nav_dashboard"):
        st.session_state.page = "Dashboard"
        st.rerun()
    
    if st.button("📄 All Articles", key="nav_articles"):
        st.session_state.page = "All Articles"
        st.rerun()
    
    if st.button("⏰ Pending Review", key="nav_pending"):
        st.session_state.page = "Pending Review"
        st.rerun()
    
    if st.button("👥 Users", key="nav_users"):
        st.session_state.page = "Users"
        st.rerun()
    
    if st.button("📈 Analytics", key="nav_analytics"):
        st.session_state.page = "Analytics"
        st.rerun()
    
    if st.button("⚙️ Settings", key="nav_settings"):
        st.session_state.page = "Settings"
        st.rerun()
    
    st.divider()
    if st.button("Logout"):
        st.session_state.authenticated = False
        st.rerun()

page = st.session_state.page

# Database
try:
    conn = get_db_connection()
    cur = conn.cursor()
except Exception as e:
    st.error(f"Database error: {str(e)}")
    st.stop()

# DASHBOARD (FROM FILE 2 - WORKING VERSION)
if page == "Dashboard":
    # Get data
    cur.execute("SELECT COUNT(*) FROM content")
    total = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status = 'PUBLISHED'")
    published = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status IN ('REVIEW', 'IN_REVIEW', 'SUBMITTED')")
    pending = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(DISTINCT author_id) FROM content")
    authors = cur.fetchone()[0]
    
    # Build recent articles HTML
    cur.execute("""
        SELECT c.title, c.status, u.email, u.name
        FROM content c
        JOIN users u ON c.author_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 4
    """)
    recent = cur.fetchall()
    
    recent_html = ""
    for article in recent:
        author = article[3] if article[3] else article[2].split('@')[0]
        recent_html += f"<div class='article-item'><div class='article-content'><div class='article-title'>{article[0]}</div><div class='article-meta'>{author} • যাত্রা-আড্ডা</div></div><span class='badge badge-published'>PUBLISHED</span></div>"
    
    # Build top performing HTML
    top = [
        ("50,000 Commuters Stranded as Metro Breaks Down", 5621, 89),
        ("Coaching Center Mafia: The Rs 2,000 Crore Industry", 4892, 127),
        ("7 Century-Old Sweet Shops Kolkata Has Forgotten", 3245, 56),
        ("Deshapriyas Park's Revolutionary Eco-Friendly Pandal", 2847, 34)
    ]
    
    top_html = ""
    for title, views, comments in top:
        top_html += f"<div class='top-item'><div class='top-title'>{title}</div><div class='top-stats'><span class='dot-red'>●</span> {views:,} views • <span class='comment-blue'>💬</span> {comments}</div></div>"
    
    # Render everything
    st.markdown(f"""
    <div class='dashboard-container'>
        <div class='stats-grid'>
            <div class='stat-card'>
                <span class='stat-label'>Total Articles</span>
                <div class='stat-value'>{total}</div>
            </div>
            <div class='stat-card'>
                <span class='stat-label'>Published</span>
                <div class='stat-value green'>{published}</div>
            </div>
            <div class='stat-card'>
                <span class='stat-label'>Pending Review</span>
                <div class='stat-value yellow'>{pending}</div>
            </div>
            <div class='stat-card'>
                <span class='stat-label'>Authors</span>
                <div class='stat-value purple'>{authors}</div>
            </div>
            <div class='stat-card'>
                <span class='stat-label'>Total Views</span>
                <div class='stat-value blue'>16,605</div>
            </div>
        </div>
        <div class='content-grid'>
            <div class='card'>
                <h3>Recent Articles</h3>
                {recent_html}
            </div>
            <div class='card'>
                <h3>Top Performing</h3>
                {top_html}
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# ALL ARTICLES (FROM FILE 1 - FIXED QUERIES)
elif page == "All Articles":
    st.markdown("<div class='dashboard-container'>", unsafe_allow_html=True)
    
    cur.execute("""
        SELECT c.id, c.title, c.status, c.created_at, u.name, u.email
        FROM content c
        JOIN users u ON c.author_id = u.id
        ORDER BY c.created_at DESC
    """)
    articles = cur.fetchall()
    
    for article in articles:
        author = article[4] if article[4] else article[5].split('@')[0]
        date = article[3].strftime('%b %d, %Y') if article[3] else 'N/A'
        
        st.markdown(f"""
        <div style='background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; margin-bottom: 16px;'>
            <div style='display: flex; justify-content: space-between; align-items: start;'>
                <div style='flex: 1;'>
                    <div style='font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px;'>{article[1]}</div>
                    <div style='font-size: 13px; color: #6b7280;'>{author} • যাত্রা-আড্ডা • {date}</div>
                </div>
                <span class='badge badge-published'>{article[2]}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

# PENDING REVIEW (FROM FILE 1 - FIXED QUERIES)
elif page == "Pending Review":
    st.markdown("<div class='dashboard-container'>", unsafe_allow_html=True)
    
    cur.execute("""
        SELECT c.id, c.title, c.summary, u.name, u.email, c.created_at
        FROM content c
        JOIN users u ON c.author_id = u.id
        WHERE c.status IN ('REVIEW', 'IN_REVIEW', 'SUBMITTED')
        ORDER BY c.created_at DESC
    """)
    pending = cur.fetchall()
    
    if not pending:
        st.markdown("""
        <div style='background: #d1fae5; border: 1px solid #10b981; border-radius: 10px; padding: 32px; text-align: center;'>
            <div style='font-size: 48px; margin-bottom: 16px;'>🎉</div>
            <div style='font-size: 18px; font-weight: 600; color: #065f46;'>All caught up!</div>
            <div style='font-size: 14px; color: #047857; margin-top: 8px;'>No articles pending review</div>
        </div>
        """, unsafe_allow_html=True)
    else:
        for article in pending:
            author = article[3] if article[3] else article[4].split('@')[0]
            date = article[5].strftime('%b %d, %Y') if article[5] else 'N/A'
            excerpt = article[2][:150] + "..." if article[2] and len(article[2]) > 150 else article[2] or "No summary available"
            
            st.markdown(f"""
            <div style='background: #fffbeb; border: 2px solid #fbbf24; border-radius: 10px; padding: 24px; margin-bottom: 20px;'>
                <div style='display: flex; gap: 20px;'>
                    <div style='width: 120px; height: 120px; background: #e5e7eb; border-radius: 8px; flex-shrink: 0;'></div>
                    <div style='flex: 1;'>
                        <div style='display: flex; justify-content: space-between; margin-bottom: 8px;'>
                            <span style='background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; text-transform: uppercase;'>PENDING REVIEW</span>
                            <span style='color: #6b7280; font-size: 12px;'>{date}</span>
                        </div>
                        <h3 style='font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111827;'>{article[1]}</h3>
                        <p style='color: #6b7280; font-size: 13px; margin-bottom: 12px;'>{excerpt}</p>
                        <div style='color: #6b7280; font-size: 12px; margin-bottom: 16px;'>Author: {author}</div>
                        <div style='display: flex; gap: 10px;'>
                            <button style='background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;'>✓ Approve & Publish</button>
                            <button style='background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;'>Request Changes</button>
                            <button style='background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;'>✗ Reject</button>
                            <button style='background: white; color: #374151; border: 1px solid #e5e7eb; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;'>👁 Preview</button>
                        </div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

# USERS (FROM FILE 1 - FIXED QUERIES)
elif page == "Users":
    st.markdown("""
    <div class='dashboard-container'>
        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;'>
            <h2 style='font-size: 24px; font-weight: 600; margin: 0;'>Users & Authors</h2>
            <button style='background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;'>Add User</button>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    cur.execute("""
        SELECT u.id, u.email, u.name, u.role,
               COUNT(DISTINCT c.id) as article_count
        FROM users u
        LEFT JOIN content c ON u.id = c.author_id
        GROUP BY u.id, u.email, u.name, u.role
        ORDER BY article_count DESC
    """)
    users = cur.fetchall()
    
    for user in users:
        initials = user[2][:2].upper() if user[2] else user[1][:2].upper()
        name = user[2] if user[2] else user[1].split('@')[0]
        role_colors = {
            'ADMIN': '#dc2626',
            'AUTHOR': '#8b5cf6',
            'EDITOR': '#3b82f6'
        }
        color = role_colors.get(user[3], '#6b7280')
        
        st.markdown(f"""
        <div style='background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 0 40px 12px 40px;'>
            <div style='display: flex; align-items: center; justify-content: space-between;'>
                <div style='display: flex; align-items: center; gap: 16px;'>
                    <div style='width: 48px; height: 48px; background: {color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px;'>{initials}</div>
                    <div>
                        <div style='font-size: 15px; font-weight: 600; color: #111827;'>{name}</div>
                        <div style='font-size: 12px; color: #6b7280;'>{user[1]}</div>
                    </div>
                </div>
                <div style='display: flex; align-items: center; gap: 32px;'>
                    <div style='text-align: right;'>
                        <div style='font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;'>Role</div>
                        <div style='font-size: 14px; font-weight: 600; color: #111827;'>{user[3]}</div>
                    </div>
                    <div style='text-align: right;'>
                        <div style='font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;'>Articles</div>
                        <div style='font-size: 14px; font-weight: 600; color: #111827;'>{user[4]}</div>
                    </div>
                    <div style='text-align: right;'>
                        <div style='font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;'>Followers</div>
                        <div style='font-size: 14px; font-weight: 600; color: #111827;'>342</div>
                    </div>
                    <button style='background: white; color: #6b7280; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;'>✏️</button>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

# ANALYTICS - COMPLETE WORKING VERSION
elif page == "Analytics":
    # Build category bars HTML
    category_html = ""
    categories = [
        ("যাত্রা-আড্ডা", 5621, 100),
        ("শিল্প", 4892, 87),
        ("খাদ্য-আড্ডা", 3245, 58),
        ("ইতিহাস", 2847, 51)
    ]
    
    for cat, views, pct in categories:
        category_html += f"<div style='margin-bottom: 18px;'><div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'><span style='font-size: 14px; font-weight: 600; color: #111827;'>{cat}</span><span style='font-size: 13px; color: #6b7280;'>{views:,} views</span></div><div style='position: relative; width: 100%; height: 28px; background: #f3f4f6; border-radius: 14px; overflow: hidden;'><div style='position: absolute; width: {pct}%; height: 100%; background: linear-gradient(90deg, #dc2626, #8b5cf6);'></div><div style='position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 11px; font-weight: 700; color: white;'>{pct}%</div></div></div>"
    
    # Build author rows HTML
    author_html = ""
    authors = [
        ("Anindita Chatterjee", "AC", "#dc2626", 23, 2847, 34),
        ("Rajesh Kumar", "RK", "#8b5cf6", 45, 5621, 89),
        ("Debashish Ghosh", "DG", "#3b82f6", 19, 4892, 127),
        ("Soumya Sengupta", "SS", "#10b981", 34, 0, 0),
        ("Rituparna Das", "RD", "#f59e0b", 41, 0, 0)
    ]
    
    for idx, (name, initials, color, articles, views, engagement) in enumerate(authors, 1):
        border = "border-bottom: 1px solid #f3f4f6;" if idx < len(authors) else ""
        author_html += f"<div style='display: flex; align-items: center; gap: 16px; padding: 18px 0; {border}'><div style='font-size: 16px; font-weight: 600; color: #9ca3af; width: 32px;'>#{idx}</div><div style='width: 44px; height: 44px; background: {color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px;'>{initials}</div><div style='flex: 1;'><div style='font-size: 14px; font-weight: 600; color: #111827;'>{name}</div><div style='font-size: 12px; color: #6b7280;'>{articles} articles</div></div><div style='text-align: right; min-width: 100px;'><div style='font-size: 16px; font-weight: 700; color: #111827;'>{views:,}</div><div style='font-size: 10px; color: #9ca3af;'>TOTAL VIEWS</div></div><div style='text-align: right; min-width: 100px;'><div style='font-size: 16px; font-weight: 700; color: #111827;'>{engagement}</div><div style='font-size: 10px; color: #9ca3af;'>AVG ENGAGEMENT</div></div></div>"
    
    # Output everything in ONE call
    st.markdown(f"""
    <div style='padding: 32px 40px; max-width: 1600px; margin: 0 auto;'>
        <h2 style='margin-bottom: 32px; font-size: 28px; font-weight: 600;'>Analytics Overview</h2>
        <div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;'>
            <div style='background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 28px; text-align: center;'>
                <div style='font-size: 42px; font-weight: 700; color: #3b82f6;'>16,605</div>
                <div style='font-size: 13px; color: #6b7280; margin-top: 8px;'>Total Views (30 days)</div>
            </div>
            <div style='background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 28px; text-align: center;'>
                <div style='font-size: 42px; font-weight: 700; color: #10b981;'>77</div>
                <div style='font-size: 13px; color: #6b7280; margin-top: 8px;'>Avg Engagement</div>
            </div>
            <div style='background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 28px; text-align: center;'>
                <div style='font-size: 42px; font-weight: 700; color: #8b5cf6;'>4151</div>
                <div style='font-size: 13px; color: #6b7280; margin-top: 8px;'>Avg Views per Article</div>
            </div>
        </div>
        <div style='background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px; margin-bottom: 24px;'>
            <h3 style='font-size: 24px; font-weight: 600; margin-bottom: 24px;color: #111827;'>Top Categories by Views</h3>
            {category_html}
        </div>
        <div style='background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px;'>
            <h3 style='font-size: 24px; font-weight: 600; margin-bottom: 24px;color: #111827;'>Top Authors by Performance</h3>
            {author_html}
        </div>
    </div>
    """, unsafe_allow_html=True)

# SETTINGS
elif page == "Settings":
    st.markdown("""
    <div class='dashboard-container'>
        <h2 style='margin-bottom: 24px; font-size: 24px; font-weight: 600;'>Settings</h2>
        <div style='background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px;'>
            <h3 style='font-size: 17px; font-weight: 600; margin-bottom: 20px;'>Portal Configuration</h3>
            <p style='color: #6b7280; font-size: 14px;'>Settings functionality coming soon...</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

else:
    st.markdown("<div style='padding: 40px;'><h2>Page not found</h2></div>", unsafe_allow_html=True)

cur.close()
conn.close()
