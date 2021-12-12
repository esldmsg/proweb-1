import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Request, Response, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from passlib.context import CryptContext
from . import  models
from .database import SessionLocal, engine
import shutil
import httpx
import asyncio
import requests
from twilio.rest import Client
models.Base.metadata.create_all(bind=engine)




app = FastAPI()

origins = [
    
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "dd2750f47f3ea7f68bd4c73a33739d2c11ed41a43771061d79e8413babed160a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

account_sid = os.environ.get('TWILIOACCOUNTSID')
auth_token = os.environ.get('TWILIOAUTH')
client = Client(account_sid, auth_token)

class Item(BaseModel):
    id:Optional[int] = None
    title: str
    description:str
    url:str
    price: int
    rate:Optional[int] = 0
    class Config:
        orm_mode = True

class Shipped(BaseModel):
    id:Optional[int] = None
    title: str
    description:str
    url:str
    price: int
    rate:int 
    class Config:
        orm_mode = True



class TokenData(BaseModel):
    username: Optional[str] = None
    class Config:
            orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password:str
    is_active:bool
    class Config:
        orm_mode = True

class Users(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    fake_hashed_password:str
    is_active:bool
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    class Config:
            orm_mode = True

class UserInDB(User):
    hashed_password : str

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(password, hashed_password:int):
    
    if not verify_password(password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect  password",
            headers={"WWW-Authenticate": "Bearer"},
        )

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db) ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username==token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

    

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.get("/api/users/me")
async def payment( current_user: User = Depends(get_current_active_user)):
    return current_user

@app.post("/signUp/{username}/{email}/{password}")
def create_user(username, email, password, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email==email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    fake_hashed_password = get_password_hash(password)
    new_user = models.User(email=email, username=username, hashed_password=fake_hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message":f" user successfully created"
    }

@app.post("/token", response_model=Token)
async def signIn_user(form_data:OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    activeUser=form_data.username
    user = db.query(models.User).filter(models.User.username==activeUser).first()
    if not user :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
            )
    password = form_data.password
    if not verify_password(password, user.hashed_password) :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect password or  password ",
            headers={"WWW-Authenticate": "Bearer"},
            )
            
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
    data={"sub": user.username},expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

    
@app.post("/user/item", response_model=Item)
def create_item_for_user(item:Item,  current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db), ):
    #db_item = db.query(models.Item).filter(models.Item.title==item.title).first()
    user_id = current_user.id
    new_item = models.Item(title=item.title, price=item.price, url=item.url, description=item.description,  owner_id=user_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.delete("/delete/{item_id}")
def delete_item_for_user( item_id:int, db: Session = Depends(get_db),  current_user: User = Depends(get_current_active_user)):
    user_id = current_user.id
    db_check_for_item_id = db.query(models.Item).filter(models.Item.id==item_id).first()
    if db_check_for_item_id is None :
        raise HTTPException(status_code=400, detail="item does not exist")

    db_check_for_user_id = db.query(models.User.id).filter(models.User.id==user_id).first()
    if db_check_for_user_id :
        db_check_for_owner_id = db.query(models.Item.owner_id).filter(models.Item.id==item_id).first()
        if  db_check_for_user_id == db_check_for_owner_id :
            db_item_to_be_deleted = db.query(models.Item).filter(models.Item.id==item_id).first()
            db.delete( db_item_to_be_deleted)
            db.commit()
            return {
                "message":f" item with item_id {item_id} deleted"
            }
        else:
              raise HTTPException(status_code=400, detail="You are not ment to delete this item")
    else :  return {
                "message":f" user does not exist"
            }

@app.get("/items/", response_model=List[Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    user_id = current_user.id
    db_user = db.query(models.User).filter(models.User.id==user_id).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="User does not exist")

    db_item = db.query(models.Item).filter(models.Item.owner_id==user_id).first()
    if db_item is None:
        raise HTTPException(status_code=400, detail="You are not ment to access this page")
    return db.query(models.Item).filter(models.Item.owner_id==user_id).all()


# @app.post('/uploadfile')
# async def upload(file:UploadFile = File(...)):
#     with open("media/"+file.filename, "wb+") as image:
#         shutil.copyfileobj(file.file, image)
#     url = str("media/"+file.filename)
#     return url
    

@app.post("/admin/items/", response_model = Item)
def create_item_for_all_user( item:Item, db: Session = Depends(get_db),  current_user: User = Depends(get_current_active_user)):
    user = db.query(models.User).filter(models.User.username==current_user.username).first()
    if user.username == "admin":
        user_id =  current_user.id
        new_item = models.Item(title=item.title, price=item.price, url=item.url, description=item.description, owner_id=user_id)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item
    else:
       raise HTTPException(status_code=400, detail="You are not an Admin")

    


@app.delete("/delete/admin/{item_id}")
def delete_item_for_all(item_id:int, db: Session = Depends(get_db),  current_user: User = Depends(get_current_active_user)):
    user = db.query(models.User).filter(models.User.username==current_user.username).first()
    if user.username == "admin":
            user_id =  current_user.id
            db_check_for_item_id = db.query(models.Item).filter(models.Item.id==item_id).first()
            if db_check_for_item_id is None :
                raise HTTPException(status_code=400, detail="item does not exist")

            db_check_for_user_id = db.query(models.User.id).filter(models.User.id==user_id).first()
            if db_check_for_user_id :
                db_check_for_owner_id = db.query(models.Item.owner_id).filter(models.Item.id==item_id).first()
                if  db_check_for_user_id == db_check_for_owner_id :
                    db_item_to_be_deleted = db.query(models.Item).filter(models.Item.id==item_id).first()
                    db.delete( db_item_to_be_deleted)
                    db.commit()
                    return {
                        "message":f" item with item_id {item_id} deleted"
                    }
                else:
                    raise HTTPException(status_code=400, detail="You are not ment to delete this item")
            else :  return {
                        "message":f" user does not exist"
                    }
    else:
       raise HTTPException(status_code=400, detail="You are not an Admin")


@app.get("/allitems/", response_model=List[Item])
def read_items_for_all_user(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username=="admin").first()
    return db.query(models.Item).filter(models.Item.owner_id==user.id).all()

@app. post("/user/pay/item/{title}/{price}/{rate}/{description}/{url}")
async def pay(shipped:Shipped, current_user : User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    email= current_user.email
    name = current_user.username
    user_id = current_user.id
    url = "https://api.paystack.co/transaction/initialize"
    payload = {"email": email, "amount":shipped.rate*100}
    # "custom_fields":{"fullname":name,"productName":shipped.title, "productDescription":shipped.description,  "Image":shipped.url}
    # metadata={"name":name, "productName":shipped.title, "productDescription":shipped.description, "Image":shipped.url}
    headers = {"Authorization":os.environ.get('PAYSTACK_AUTHORIZATION_KEY')}
    response = requests. post(url, headers=headers, data=payload)
    if response.status_code == 200:
        message = client.messages \
                .create(
                     body=f"{name } with email {email } bought {shipped.description} {shipped.title} at the rate of {shipped.rate} please confirm payment before placing order",
                     from_='+14176076477',
                     to='+2348164836050'
                 )
        new_item = models.Shipped(title=shipped.title, price=shipped.price, rate=shipped.rate, description= shipped.description, url= shipped.url, owner_id=user_id)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        json_Response= response.json()
        return (json_Response["data"]["authorization_url"])

    else:
         raise HTTPException(status_code=400, detail="Try Again Something Went Wrong")

@app.get("/callback")
def callback( trxref, reference, db: Session = Depends(get_db)):
    
    url = "https://api.paystack.co/transaction/verify/:{reference}"
    headers = {"Authorization": "Bearer sk_test_ecb81509f58a30dcdafc38bb05e25365fd97dc22"}
    response = requests.get(url, headers = headers)
    json_Response = response.json()
    return (json_Response)

@app.get("/shipping/", response_model=List[Shipped])
def read_shipped_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    user_id = current_user.id
    db_user = db.query(models.User).filter(models.User.id==user_id).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="User does not exist")

    db_item = db.query(models.Shipped).filter(models.Shipped.owner_id==user_id).first()
    if db_item is None:
        raise HTTPException(status_code=400, detail="You are not ment to access this page")
    return db.query(models.Shipped).filter(models.Shipped.owner_id==user_id).all()


@app.delete("/shipping/delete/{shipped_id}")
def delete_shipped_item_for_user( shipped_id:int, db: Session = Depends(get_db),  current_user: User = Depends(get_current_active_user)):
    user_id = current_user.id
    db_check_for_shipped_id = db.query(models.Shipped).filter(models.Shipped.id==shipped_id).first()
    if db_check_for_shipped_id is None :
        raise HTTPException(status_code=400, detail="item does not exist")

    db_check_for_user_id = db.query(models.User.id).filter(models.User.id==user_id).first()
    if db_check_for_user_id :
        db_check_for_owner_id = db.query(models.Shipped.owner_id).filter(models.Shipped.id==shipped_id).first()
        if  db_check_for_user_id == db_check_for_owner_id :
            db_item_to_be_deleted = db.query(models.Shipped).filter(models.Shipped.id==shipped_id).first()
            db.delete( db_item_to_be_deleted)
            db.commit()
            return {
                "message":f" item with shipped_id {shipped_id} deleted"
            }
        else:
              raise HTTPException(status_code=400, detail="You are not ment to delete this item")
    else :  return {
                "message":f" user does not exist"
            }

