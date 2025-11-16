import streamlit as st
from datetime import datetime
import pandas as pd
from db import get_db_connection
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(
    page_title="SEKOR-BKC Admin Portal",
    page_icon="🏛️",
    layout="wide"
)

def check_auth():
    if 'authenticated' not in st.session_state:
        st.session_state.authenticated = False
    
    if not st.session_state.authenticated:
        st.title("🔐 Admin Login")
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        
        if st.button("Login"):
            import os
            if username == os.getenv("ADMIN_USERNAME") and password == os.getenv("ADMIN_PASSWORD"):
                st.session_state.authenticated = True
                st.rerun()
            else:
                st.error("Invalid credentials")
        st.stop()

check_auth()

st.sidebar.title("🏛️ SEKOR-BKC Admin")
page = st.sidebar.selectbox("Navigation", [
    "📊 Dashboard",
    "📝 Content Moderation",
    "👥 User Management",
    "📁 Media Library",
    "🏷️ Categories & Tags",
    "📈 Analytics"
])

if st.sidebar.button("🚪 Logout"):
    st.session_state.authenticated = False
    st.rerun()

if page == "📊 Dashboard":
    st.title("📊 Platform Dashboard")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    col1, col2, col3, col4 = st.columns(4)
    
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]
    col1.metric("👥 Total Users", total_users)
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status = 'PUBLISHED'")
    published = cur.fetchone()[0]
    col2.metric("📝 Published Stories", published)
    
    cur.execute("SELECT COUNT(*) FROM content WHERE status IN ('REVIEW', 'IN_REVIEW', 'SUBMITTED')")
    pending = cur.fetchone()[0]
    col3.metric("⏳ Pending Review", pending)
    
    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'AUTHOR'")
    creators = cur.fetchone()[0]
    col4.metric("✍️ Authors", creators)
    
    st.divider()
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📅 Recent Content")
        cur.execute("""
            SELECT c.title, c.status, c.created_at, u.email as author
            FROM content c
            JOIN users u ON c.author_id = u.id
            ORDER BY c.created_at DESC LIMIT 10
        """)
        recent = cur.fetchall()
        if recent:
            df = pd.DataFrame(recent, columns=['Title', 'Status', 'Created', 'Author'])
            st.dataframe(df, use_container_width=True)
        else:
            st.info("No content yet")
    
    with col2:
        st.subheader("👤 New Users")
        cur.execute("""
            SELECT email, role, created_at 
            FROM users 
            ORDER BY created_at DESC LIMIT 10
        """)
        new_users = cur.fetchall()
        if new_users:
            df_users = pd.DataFrame(new_users, columns=['Email', 'Role', 'Joined'])
            st.dataframe(df_users, use_container_width=True)
        else:
            st.info("No users yet")
    
    st.subheader("📊 Content Breakdown")
    cur.execute("""
        SELECT status, COUNT(*) as count 
        FROM content 
        GROUP BY status
    """)
    content_status = cur.fetchall()
    if content_status:
        df_status = pd.DataFrame(content_status, columns=['Status', 'Count'])
        fig = px.pie(df_status, values='Count', names='Status', title='Content by Status')
        st.plotly_chart(fig, use_container_width=True)
    
    st.subheader("👥 Users by Role")
    cur.execute("""
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
    """)
    user_roles = cur.fetchall()
    if user_roles:
        df_roles = pd.DataFrame(user_roles, columns=['Role', 'Count'])
        fig2 = px.bar(df_roles, x='Role', y='Count', title='User Distribution')
        st.plotly_chart(fig2, use_container_width=True)
    
    cur.close()
    conn.close()

elif page == "📝 Content Moderation":
    st.title("📝 Content Moderation")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    status_filter = st.selectbox("Filter by Status", [
        "DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED", 
        "SUBMITTED", "IN_REVIEW", "CHANGES_REQUESTED", 
        "APPROVED", "REJECTED", "SCHEDULED"
    ])
    
    # Fixed: removed content_type
    cur.execute("""
        SELECT c.id, c.title, c.status, c.created_at, u.email as author
        FROM content c
        JOIN users u ON c.author_id = u.id
        WHERE c.status = %s
        ORDER BY c.created_at DESC
    """, (status_filter,))
    
    content = cur.fetchall()
    
    if not content:
        st.info(f"No content with status '{status_filter}'")
    
    for item in content:
        with st.expander(f"📄 {item[1] or 'Untitled'}"):
            col1, col2, col3 = st.columns([3, 1, 1])
            col1.write(f"**Author:** {item[4]}")
            col1.write(f"**Status:** {item[2]}")
            col1.write(f"**Created:** {item[3]}")
            
            if col2.button("✅ Approve", key=f"approve_{item[0]}"):
                cur.execute("UPDATE content SET status = 'PUBLISHED' WHERE id = %s", (item[0],))
                conn.commit()
                st.success("Approved!")
                st.rerun()
            
            if col3.button("❌ Reject", key=f"reject_{item[0]}"):
                cur.execute("UPDATE content SET status = 'REJECTED' WHERE id = %s", (item[0],))
                conn.commit()
                st.warning("Rejected!")
                st.rerun()
    
    cur.close()
    conn.close()

elif page == "👥 User Management":
    st.title("👥 User Management")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    search = st.text_input("🔍 Search by email")
    
    # Fixed: removed is_verified
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
        with st.expander(f"👤 {user[1]} - {user[2]}"):
            col1, col2, col3 = st.columns(3)
            col1.write(f"**Role:** {user[2]}")
            col1.write(f"**Joined:** {user[3]}")
            
            current_idx = role_options.index(user[2]) if user[2] in role_options else 0
            new_role = col2.selectbox("Change Role", role_options, 
                                     index=current_idx,
                                     key=f"role_{user[0]}")
            
            if col2.button("💾 Update Role", key=f"update_{user[0]}"):
                cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user[0]))
                conn.commit()
                st.success("Role updated!")
                st.rerun()
            
            if col3.button("🗑️ Delete User", key=f"delete_{user[0]}"):
                cur.execute("DELETE FROM users WHERE id = %s", (user[0],))
                conn.commit()
                st.warning("User deleted!")
                st.rerun()
    
    cur.close()
    conn.close()

elif page == "📁 Media Library":
    st.title("📁 Media Library")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if media table exists
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
        # Fixed: use correct column names (filename not file_name, etc.)
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
    
    cur.close()
    conn.close()

elif page == "🏷️ Categories & Tags":
    st.title("🏷️ Categories & Tags Management")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    tab1, tab2 = st.tabs(["📂 Categories", "🏷️ Tags"])
    
    with tab1:
        st.subheader("Add New Category")
        col1, col2 = st.columns(2)
        cat_name = col1.text_input("Category Name")
        cat_slug = col2.text_input("Category Slug (URL-friendly)")
        
        if st.button("➕ Add Category"):
            if cat_name:
                slug = cat_slug or cat_name.lower().replace(' ', '-')
                try:
                    cur.execute("""
                        INSERT INTO categories (name, slug) 
                        VALUES (%s, %s)
                    """, (cat_name, slug))
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
    
    cur.close()
    conn.close()

elif page == "📈 Analytics":
    st.title("📈 Platform Analytics")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
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
    else:
        st.info("No content data for the last 30 days")
    
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
    else:
        st.info("No user registration data for the last 30 days")
    
    cur.close()
    conn.close()