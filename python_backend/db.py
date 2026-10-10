"""
EvoChain-OS: PostgreSQL Database Integration Module
Supports cloud PostgreSQL hosting (Supabase, Neon, AWS RDS, Render, Railway, etc.)
with automatic table creation, preset seeding, and seamless local SQLite fallback.
"""

import os
import json
import logging
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, String, Float, DateTime, Text,
    inspect, select
)
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

logger = logging.getLogger("evochain.db")

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="EXECUTIVE_ARBITER")
    role_label = Column(String(80), nullable=False, default="Executive Arbiter")
    clearance_level = Column(String(80), nullable=False, default="Level 2 Supervised Autonomy")
    capital_escrow_threshold_m = Column(Float, nullable=False, default=5.0)
    avatar = Column(String(10), nullable=False, default="OP")
    title = Column(String(120), default="Enterprise Operator")
    badge_color = Column(String(30), default="#0071e3")
    permissions = Column(Text, default="[]")  # JSON-encoded array
    capabilities = Column(Text, default="{}")  # JSON-encoded dict
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        perms = []
        try:
            perms = json.loads(self.permissions) if self.permissions else []
        except Exception:
            perms = []

        caps = {}
        try:
            caps = json.loads(self.capabilities) if self.capabilities else {}
        except Exception:
            caps = {}

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "role_label": self.role_label,
            "roleLabel": self.role_label,
            "clearance_level": self.clearance_level,
            "clearanceLevel": self.clearance_level,
            "capital_escrow_threshold_m": float(self.capital_escrow_threshold_m or 0.0),
            "capitalEscrowThreshold": float(self.capital_escrow_threshold_m or 0.0),
            "avatar": self.avatar,
            "title": self.title,
            "badge_color": self.badge_color,
            "badgeColor": self.badge_color,
            "permissions": perms,
            "capabilities": caps,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

def load_env_file():
    """Lightweight .env loader if python-dotenv is not installed."""
    for path in [".env", "python_backend/.env", "../.env"]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip("'\"")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass

load_env_file()

def build_database_uri() -> Tuple[str, str]:
    """
    Resolves the connection URI from environment variables.
    Supports DATABASE_URL, POSTGRES_URL, or PG* parameters.
    """
    raw_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")
    
    if raw_url:
        # Normalize postgres:// to postgresql:// for SQLAlchemy 2.0
        if raw_url.startswith("postgres://"):
            raw_url = "postgresql://" + raw_url[len("postgres://"):]
        return raw_url, "PostgreSQL"

    # Check discrete PG host variables
    pghost = os.getenv("PGHOST") or os.getenv("POSTGRES_HOST")
    if pghost:
        pguser = os.getenv("PGUSER") or os.getenv("POSTGRES_USER", "postgres")
        pgpwd = os.getenv("PGPASSWORD") or os.getenv("POSTGRES_PASSWORD", "")
        pgport = os.getenv("PGPORT") or os.getenv("POSTGRES_PORT", "5432")
        pgdb = os.getenv("PGDATABASE") or os.getenv("POSTGRES_DB", "postgres")
        pgssl = os.getenv("PGSSLMODE", "prefer")
        
        auth = f"{pguser}:{pgpwd}" if pgpwd else pguser
        uri = f"postgresql://{auth}@{pghost}:{pgport}/{pgdb}?sslmode={pgssl}"
        return uri, "PostgreSQL"

    # Local SQLite persistent fallback when no PostgreSQL URL is provided
    os.makedirs("python_backend/data", exist_ok=True)
    sqlite_path = os.path.abspath("python_backend/data/sahirate_users.db")
    return f"sqlite:///{sqlite_path}", "SQLite Fallback"

class DatabaseManager:
    def __init__(self):
        self.engine = None
        self.session_factory = None
        self.provider = "Unknown"
        self.connection_uri = ""
        self.is_connected = False
        self.initialize()

    def initialize(self):
        uri, provider = build_database_uri()
        self.connection_uri = uri
        self.provider = provider

        try:
            if provider == "PostgreSQL":
                # Connection pooling for high-throughput enterprise API
                self.engine = create_engine(
                    uri,
                    pool_size=10,
                    max_overflow=20,
                    pool_timeout=15,
                    pool_recycle=1800,
                    pool_pre_ping=True
                )
            else:
                self.engine = create_engine(
                    uri,
                    connect_args={"check_same_thread": False}
                )

            # Test connection
            with self.engine.connect() as conn:
                pass

            Base.metadata.create_all(bind=self.engine)
            self.session_factory = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.engine))
            self.is_connected = True
            logger.info(f"Database successfully connected using provider: {self.provider}")
        except Exception as e:
            logger.warning(f"Failed to connect to primary {provider} ({e}). Falling back to local SQLite.")
            # Fallback to local SQLite so backend never crashes
            os.makedirs("python_backend/data", exist_ok=True)
            sqlite_path = os.path.abspath("python_backend/data/sahirate_users.db")
            fallback_uri = f"sqlite:///{sqlite_path}"
            self.engine = create_engine(fallback_uri, connect_args={"check_same_thread": False})
            Base.metadata.create_all(bind=self.engine)
            self.session_factory = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=self.engine))
            self.provider = "SQLite (Postgres Offline Fallback)"
            self.connection_uri = fallback_uri
            self.is_connected = True

    def get_session(self):
        return self.session_factory()

    def get_status(self) -> Dict[str, Any]:
        # Mask password in URI
        masked = self.connection_uri
        if "@" in masked and ":" in masked:
            try:
                prefix, rest = masked.split("://", 1)
                user_pass, host_db = rest.split("@", 1)
                user = user_pass.split(":")[0]
                masked = f"{prefix}://{user}:***@{host_db}"
            except Exception:
                pass

        user_count = 0
        try:
            with self.get_session() as session:
                user_count = session.query(UserModel).count()
        except Exception:
            pass

        return {
            "provider": self.provider,
            "connected": self.is_connected,
            "database_url": masked,
            "table": "users",
            "registered_users_count": user_count
        }

    def seed_preset_users(self, preset_users: List[Dict[str, Any]]):
        """Seeds default demo personas into database if they do not exist."""
        try:
            with self.get_session() as session:
                for p in preset_users:
                    existing = session.query(UserModel).filter(
                        (UserModel.id == p["id"]) | (UserModel.email == p["email"].lower())
                    ).first()
                    if not existing:
                        new_user = UserModel(
                            id=p["id"],
                            name=p["name"],
                            email=p["email"].lower(),
                            password_hash=p.get("password_hash", ""),
                            role=p.get("role", "EXECUTIVE_ARBITER"),
                            role_label=p.get("role_label") or p.get("roleLabel", "Operator"),
                            clearance_level=p.get("clearance_level") or p.get("clearanceLevel", "Level 1"),
                            capital_escrow_threshold_m=float(p.get("capital_escrow_threshold_m") or p.get("capitalEscrowThreshold", 0.0)),
                            avatar=p.get("avatar", "OP"),
                            title=p.get("title", "Enterprise Operator"),
                            badge_color=p.get("badge_color") or p.get("badgeColor", "#0071e3"),
                            permissions=json.dumps(p.get("permissions", [])),
                            capabilities=json.dumps(p.get("capabilities", {})),
                            created_at=datetime.utcnow()
                        )
                        session.add(new_user)
                session.commit()
        except Exception as e:
            logger.error(f"Error seeding preset users: {e}")

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()
        try:
            with self.get_session() as session:
                user = session.query(UserModel).filter(UserModel.email == clean_email).first()
                if user:
                    return user.to_dict()
        except Exception as e:
            logger.error(f"Error fetching user by email: {e}")
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            with self.get_session() as session:
                user = session.query(UserModel).filter(UserModel.id == user_id).first()
                if user:
                    return user.to_dict()
        except Exception as e:
            logger.error(f"Error fetching user by ID: {e}")
        return None

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new registered operator in the PostgreSQL / SQLite database."""
        with self.get_session() as session:
            new_user = UserModel(
                id=user_data.get("id"),
                name=user_data.get("name"),
                email=user_data.get("email").strip().lower(),
                password_hash=user_data.get("password_hash"),
                role=user_data.get("role", "EXECUTIVE_ARBITER"),
                role_label=user_data.get("role_label") or user_data.get("roleLabel", "Executive Arbiter"),
                clearance_level=user_data.get("clearance_level") or user_data.get("clearanceLevel", "Level 2 Supervised Autonomy"),
                capital_escrow_threshold_m=float(user_data.get("capital_escrow_threshold_m") or user_data.get("capitalEscrowThreshold", 5.0)),
                avatar=user_data.get("avatar", "OP"),
                title=user_data.get("title", "Enterprise Operator"),
                badge_color=user_data.get("badge_color") or user_data.get("badgeColor", "#0071e3"),
                permissions=json.dumps(user_data.get("permissions", [])),
                capabilities=json.dumps(user_data.get("capabilities", {})),
                created_at=datetime.utcnow()
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return new_user.to_dict()

    def list_users(self) -> List[Dict[str, Any]]:
        try:
            with self.get_session() as session:
                users = session.query(UserModel).order_by(UserModel.created_at.desc()).all()
                return [u.to_dict() for u in users]
        except Exception as e:
            logger.error(f"Error listing users: {e}")
            return []

# Global database manager singleton
db_manager = DatabaseManager()
