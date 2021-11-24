from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


#SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:4747@localhost/car"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo= True
)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
