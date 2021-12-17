from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy_utils import URLType


from .database import Base




class User(Base):

    __tablename__ = "users"


    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    number = Column(String, unique=True)
    address = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String, unique=True)
    is_active = Column(Boolean, default=False)

    items = relationship("Item", back_populates="owner1", uselist=False)
    shipped = relationship("Shipped", back_populates="owner2", uselist=False)
    def __repr__ (self):
         return f"User username={self.username}, with email {self.email}, with hashed_password={self.hashed_password}"



class Item(Base):

    __tablename__ = "items"


    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    price = Column(Integer)
    rate = Column(Integer)
    url = Column(URLType)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner1 = relationship("User", back_populates="items")

    def __repr__ (self):
         return f"Item title={self.title}, with price {self.price}"

class Shipped(Base):

    __tablename__ = "shipped"


    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    price = Column(Integer)
    rate = Column(Integer)
    url = Column(URLType)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner2 = relationship("User", back_populates="shipped")

    def __repr__ (self):
         return f"Shipped title={self.title}, with rate {self.rate}"
