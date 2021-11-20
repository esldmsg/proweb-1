from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


from .database import Base




class User(Base):

    __tablename__ = "users"


    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=False)

    items = relationship("Item", back_populates="owner", uselist=False)
    def __repr__ (self):
         return f"User username={self.username}, with email {self.email}, with hashed_password={self.hashed_password}"



class Item(Base):

    __tablename__ = "items"


    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    price = Column(Integer, index=True)
    rate = Column(Integer, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")

    def __repr__ (self):
         return f"Item title={self.title}, with email {self.price}"
