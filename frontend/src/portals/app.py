import streamlit as st
from datetime import datetime
import pandas as pd
from db import get_db_connection
import plotly.express as px
import plotly.graph_objects as go
import os

st.set_page_config(
    page_title="SEKOR-BKC Admin Portal",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for colorful theme
st.markdown("""
<style>
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        margin-bottom: 1rem;
    }
    
    .metric-card.blue { background: #E3F2FD; }
    .metric-card.green { background: #E8F5E9; }
    .metric-card.purple { background: #F3E5F5; }
    .metric-card.yellow { background: #FFF9C4; }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
    }
    
    .metric-label {
        color: #666;
        font-size: 0.9rem;
        text-transform: uppercase;
    }
    
    .content-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        margin-bottom: 1rem;
    }
    
    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .badge-pending {
        background: #FFF9C4;
        color: #F57F17;
    }
    
    .badge-published {
        background: #E8F5E9;
        color: #2E7D32;
    }
    
    .admin-title {
        color: #DC143C;
        font-size: 1.5rem;
        font-weight: 600;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

def check_auth():
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    
    if not st.session_state.authenticated:
        col1, col2, col3 = st.columns([1, 1, 1])
        with col2:
            st.markdown("<h2 style='text-align: center; color: #DC143C;'>🏛️ Admin Login</h2>", unsafe_allow_html=True)
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            
            if st.button("Login", use_container_width=True):
                admin_user = os.getenv("ADMIN_USERNAME", "admin")
                admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
                
                if username == admin_user and password == admin_pass:
                    st.session_state.authenticated = True
                    st.session_state.admin_name = username
                    st.rerun()
                else:
                    st.error(f"Invalid credentials. Try: {admin_user}/{admin_pass}")
        st.stop()

check_auth()

# Header
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    st.markdown("<div class='admin-title'>Admin Portal</div>", unsafe_allow_html=True)
with col3:
    st.markdown(f"""
    <div style='text-align: right;'>
        <div style='display: inline-block; background: #DC143C; color: white; 
             width: 40px; height: 40px; border-radius: 50%; 
             text-align: center; line-height: 40px; font-weight: 600;'>A</div>
        <span style='margin-left: 0.5rem;'>Administrator</span>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### Navigation")
    
    page = st.radio("", [
        "📊 Dashboard",
        "📝 All Articles",
        "⏳ Pending Review",
        "👥 User Management",
        "📁 Media Library",
        "🏷️ Categories & Tags",
        "📈 Analytics"
    ], label_visibility="collapsed")
    
    st.markdown("---")
    if st.button("🚪 Logout", use_container_width=True):
        st.session_state.authenticated = False
        st.rerun()

try:
    conn = get_db_connection()
    cur = conn.cursor()
except Exception as e:
    st.error(f"Cannot connect to database: {str(e)}")
    st.info("Make sure Docker is running: `docker-compose up -d`")
    st.stop()

# Dashboard
if page == "📊 Dashboard":
    st.title("Dashboard")
    
    # Top metrics
    col1, col2, col3, col4, col5 = st.columns(5)
    
    cur.execute("SELECT COUNT(*) FROM content")
    total_articles = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status = 'PUBLISHED'")
    published = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status IN ('REVIEW', 'IN_REVIEW', 'SUBMITTED')")
    pending = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(DISTINCT author_id) FROM content")
    authors = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]
    
    with col1:
        st.markdown(f"""
        <div class='metric-card'>
            <div class='metric-label'>Total Articles</div>
            <div class='metric-value'>{total_articles}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class='metric-card green'>
            <div class='metric-label'>Published</div>
            <div class='metric-value' style='color: #2E7D32;'>{published}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class='metric-card yellow'>
            <div class='metric-label'>Pending Review</div>
            <div class='metric-value' style='color: #F57F17;'>{pending}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class='metric-card purple'>
            <div class='metric-label'>Authors</div>
            <div class='metric-value' style='color: #6A1B9A;'>{authors}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col5:
        st.markdown(f"""
        <div class='metric-card blue'>
            <div class='metric-label'>Total Users</div>
            <div class='metric-value' style='color: #1565C0;'>{total_users}</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Recent & Top Performing
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Recent Articles")
        cur.execute("""
            SELECT c.title, u.email, c.created_at, c.status
            FROM content c
            JOIN users u ON c.author_id = u.id
            ORDER BY c.created_at DESC
            LIMIT 5
        """)
        recent = cur.fetchall()
        
        if recent:
            for article in recent:
                status_class = 'published' if article[3] == 'PUBLISHED' else 'pending'
                st.markdown(f"""
                <div class='content-card'>
                    <div style='font-weight: 600; margin-bottom: 0.5rem;'>{article[0][:60]}...</div>
                    <div style='font-size: 0.85rem; color: #666;'>
                        {article[1]} • {article[2].strftime('%b %d, %Y')}
                    </div>
                    <span class='badge badge-{status_class}'>{article[3]}</span>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("No articles yet")
    
    with col2:
        st.subheader("Content by Status")
        cur.execute("""
            SELECT status, COUNT(*) as count 
            FROM content 
            GROUP BY status
        """)
        content_status = cur.fetchall()
        
        if content_status:
            df_status = pd.DataFrame(content_status, columns=['Status', 'Count'])
            fig = px.pie(df_status, values='Count', names='Status', title='Content Distribution')
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No content yet")

# All Articles
elif page == "📝 All Articles":
    st.title("All Articles")
    
    col1, col2, col3 = st.columns([2, 1, 1])
    with col1:
        search = st.text_input("🔍 Search articles", placeholder="Search by title...")
    with col2:
        status_filter = st.selectbox("Status", ["All", "PUBLISHED", "DRAFT", "PENDING", "REVIEW"])
    with col3:
        sort_by = st.selectbox("Sort", ["Newest", "Oldest"])
    
    query = "SELECT c.id, c.title, c.status, c.created_at, u.email FROM content c JOIN users u ON c.author_id = u.id"
    
    conditions = []
    if status_filter != "All":
        conditions.append(f"c.status = '{status_filter}'")
    if search:
        conditions.append(f"c.title ILIKE '%{search}%'")
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    query += " ORDER BY c.created_at DESC LIMIT 50"
    
    cur.execute(query)
    articles = cur.fetchall()
    
    st.markdown(f"**{len(articles)} articles found**")
    st.divider()
    
    for article in articles:
        col1, col2, col3 = st.columns([3, 1, 1])
        
        with col1:
            st.markdown(f"**{article[1]}**")
            st.caption(f"By {article[4]} • {article[3].strftime('%b %d, %Y')}")
        
        with col2:
            status_emoji = {"PUBLISHED": "🟢", "DRAFT": "⚪", "REVIEW": "🟡", "PENDING": "🟡"}
            st.write(f"{status_emoji.get(article[2], '⚪')} {article[2]}")
        
        with col3:
            if st.button("View", key=f"view_{article[0]}"):
                st.info(f"Article ID: {article[0]}")
        
        st.divider()

# Pending Review
elif page == "⏳ Pending Review":
    st.title("Pending Review")
    
    cur.execute("""
        SELECT c.id, c.title, c.summary, c.created_at, u.email, u.name
        FROM content c
        JOIN users u ON c.author_id = u.id
        WHERE c.status IN ('REVIEW', 'IN_REVIEW', 'SUBMITTED')
        ORDER BY c.created_at DESC
    """)
    
    pending_articles = cur.fetchall()
    
    if pending_articles:
        st.markdown(f"""
        <div class='badge badge-pending' style='font-size: 1rem; padding: 0.5rem 1rem;'>
            {len(pending_articles)} article(s) pending review
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        for article in pending_articles:
            st.markdown(f"### {article[1]}")
            if article[2]:
                st.write(article[2][:200] + "..." if len(article[2]) > 200 else article[2])
            st.caption(f"Author: {article[5] or article[4]} • Submitted: {article[3].strftime('%B %d, %Y')}")
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                if st.button("✅ Approve & Publish", key=f"approve_{article[0]}", use_container_width=True):
                    cur.execute("UPDATE content SET status = 'PUBLISHED' WHERE id = %s", (article[0],))
                    conn.commit()
                    st.success("Published!")
                    st.rerun()
            
            with col2:
                if st.button("📝 Request Changes", key=f"changes_{article[0]}", use_container_width=True):
                    cur.execute("UPDATE content SET status = 'CHANGES_REQUESTED' WHERE id = %s", (article[0],))
                    conn.commit()
                    st.warning("Changes requested")
                    st.rerun()
            
            with col3:
                if st.button("❌ Reject", key=f"reject_{article[0]}", use_container_width=True):
                    cur.execute("UPDATE content SET status = 'REJECTED' WHERE id = %s", (article[0],))
                    conn.commit()
                    st.error("Rejected")
                    st.rerun()
            
            with col4:
                if st.button("👁️ Preview", key=f"preview_{article[0]}", use_container_width=True):
                    st.info("Preview feature")
            
            st.divider()
    else:
        st.success("🎉 No articles pending review!")

# User Management
elif page == "👥 User Management":
    st.title("👥 User Management")
    
    search = st.text_input("🔍 Search by email")
    
    if search:
        cur.execute("""
            SELECT id, email, role, created_at 
            FROM users 
            WHERE email ILIKE %s
            ORDER BY created_at DESC
        """, (f"%{search}%",))
    else:
        cur.execute("""
            SELECT id, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 50
        """)
    
    users = cur.fetchall()
    
    if not users:
        st.info("No users found")
    
    role_options = ["READER", "AUTHOR", "EDITOR", "ADMIN"]
    
    for user in users:
        col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
        
        with col1:
            initials = user[1][:2].upper()
            st.markdown(f"""
            <div style='display: flex; align-items: center; gap: 1rem;'>
                <div style='width: 40px; height: 40px; border-radius: 50%; 
                     background: #DC143C; color: white; display: flex; 
                     align-items: center; justify-content: center; font-weight: 600;'>
                    {initials}
                </div>
                <div>
                    <div style='font-weight: 600;'>{user[1]}</div>
                    <div style='font-size: 0.85rem; color: #666;'>{user[3].strftime('%b %d, %Y')}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.write(f"**{user[2]}**")
        
        with col3:
            current_idx = role_options.index(user[2]) if user[2] in role_options else 0
            new_role = st.selectbox("Role", role_options, index=current_idx, key=f"role_{user[0]}", label_visibility="collapsed")
        
        with col4:
            if st.button("💾 Save", key=f"save_{user[0]}"):
                cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user[0]))
                conn.commit()
                st.success("Updated!")
                st.rerun()
        
        st.divider()

# Media Library
elif page == "📁 Media Library":
    st.title("📁 Media Library")
    
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'media'
        );
    """)
    table_exists = cur.fetchone()[0]
    
    if not table_exists:
        st.warning("Media table doesn't exist yet.")
    else:
        cur.execute("""
            SELECT id, filename, mime_type, size, created_at, user_id
            FROM media
            ORDER BY created_at DESC
            LIMIT 100
        """)
        
        media = cur.fetchall()
        
        if media:
            df_media = pd.DataFrame(media, columns=['ID', 'File Name', 'Type', 'Size (bytes)', 'Uploaded', 'User ID'])
            df_media['Size (MB)'] = (df_media['Size (bytes)'] / 1024 / 1024).round(2)
            st.dataframe(df_media, use_container_width=True)
            
            cur.execute("SELECT SUM(size) FROM media")
            total_size = cur.fetchone()[0] or 0
            st.metric("💾 Total Storage Used", f"{(total_size / 1024 / 1024 / 1024):.2f} GB")
        else:
            st.info("No media files yet")

# Categories & Tags
elif page == "🏷️ Categories & Tags":
    st.title("🏷️ Categories & Tags Management")
    
    tab1, tab2 = st.tabs(["📂 Categories", "🏷️ Tags"])
    
    with tab1:
        st.subheader("Add New Category")
        col1, col2 = st.columns(2)
        cat_name = col1.text_input("Category Name")
        cat_slug = col2.text_input("Category Slug")
        
        if st.button("➕ Add Category"):
            if cat_name:
                slug = cat_slug or cat_name.lower().replace(' ', '-')
                try:
                    cur.execute("INSERT INTO categories (name, slug) VALUES (%s, %s)", (cat_name, slug))
                    conn.commit()
                    st.success("Category added!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Error: {e}")
        
        st.divider()
        cur.execute("SELECT id, name, slug FROM categories ORDER BY created_at DESC")
        categories = cur.fetchall()
        
        if categories:
            for cat in categories:
                col1, col2 = st.columns([4, 1])
                col1.write(f"📂 {cat[1]} ({cat[2]})")
                if col2.button("🗑️", key=f"delcat_{cat[0]}"):
                    cur.execute("DELETE FROM categories WHERE id = %s", (cat[0],))
                    conn.commit()
                    st.rerun()
        else:
            st.info("No categories yet")
    
    with tab2:
        st.subheader("Add New Tag")
        tag_name = st.text_input("Tag Name")
        if st.button("➕ Add Tag"):
            if tag_name:
                try:
                    cur.execute("INSERT INTO tags (name) VALUES (%s)", (tag_name,))
                    conn.commit()
                    st.success("Tag added!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Error: {e}")
        
        st.divider()
        cur.execute("SELECT id, name FROM tags ORDER BY name")
        tags = cur.fetchall()
        
        if tags:
            for tag in tags:
                col1, col2 = st.columns([4, 1])
                col1.write(f"🏷️ {tag[1]}")
                if col2.button("🗑️", key=f"deltag_{tag[0]}"):
                    cur.execute("DELETE FROM tags WHERE id = %s", (tag[0],))
                    conn.commit()
                    st.rerun()
        else:
            st.info("No tags yet")

# Analytics
elif page == "📈 Analytics":
    st.title("📈 Platform Analytics")
    
    col1, col2, col3 = st.columns(3)
    
    cur.execute("SELECT COUNT(*) FROM content WHERE created_at > NOW() - INTERVAL '30 days'")
    monthly_content = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'")
    monthly_users = cur.fetchone()[0]
    
    with col1:
        st.metric("📝 Content (30 days)", monthly_content)
    with col2:
        st.metric("👥 New Users (30 days)", monthly_users)
    with col3:
        st.metric("📊 Avg Engagement", "4.2/5")
    
    st.divider()
    
    cur.execute("""
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM content
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    """)
    growth = cur.fetchall()
    
    if growth:
        df_growth = pd.DataFrame(growth, columns=['Date', 'New Content'])
        fig = px.line(df_growth, x='Date', y='New Content', title='Content Growth (Last 30 Days)')
        st.plotly_chart(fig, use_container_width=True)
    
    cur.execute("""
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    """)
    user_growth = cur.fetchall()
    
    if user_growth:
        df_user_growth = pd.DataFrame(user_growth, columns=['Date', 'New Users'])
        fig2 = px.bar(df_user_growth, x='Date', y='New Users', title='User Registrations (Last 30 Days)')
        st.plotly_chart(fig2, use_container_width=True)

cur.close()
conn.close()