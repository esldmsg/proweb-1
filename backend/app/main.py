from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile
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
models.Base.metadata.create_all(bind=engine)


from .baseapi import BaseAPI
from . import utils
from .errors import InvalidDataError

app = FastAPI()

origins = [
    
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "dd2750f47f3ea7f68bd4c73a33739d2c11ed41a43771061d79e8413babed160a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



class Item(BaseModel):
    id:Optional[int] = None
    title: str
    description:str
    price: int
    rate:Optional[int] = 0
    # owner_id:Optional[int] = None
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
    name: str
    email: str
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


@app.post("/payment123w")
class Transaction(BaseAPI):
    def initialize(
        self, email, amount, plan=None, reference=None, channel=None, metadata=None
    ):
        """
        Initialize a transaction and returns the response
        args:
        email -- Customer's email address
        amount -- Amount to charge
        plan -- optional
        Reference -- optional
        channel -- channel type to use
        metadata -- a list if json data objects/dicts
        """
        amount = utils.validate_amount(amount)

        if not email:
            raise InvalidDataError("Customer's Email is required for initialization")

        url = self._url("/initialize")
        payload = {
            "email": email,
            "amount": amount,
        }

        if plan:
            payload.update({"plan": plan})
        if channel:
            payload.update({"channels": channel})
        if reference:
            payload.update({"reference": reference})
        if metadata:
            payload = payload.update({"metadata": {"custom_fields": metadata}})

        return self._handle_request("POST", url, payload)

    def verify(self, reference):
            """
            Verifies a transaction using the provided reference number
            args:
            reference -- reference of the transaction to verify
            """

            reference = str(reference)
            url = self._url("/transaction/verify/{}".format(reference))
            return self._handle_request("GET", url)

@app.get("/payment")
async def paymode(  current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db), response_class=RedirectResponse, status_code=302 ):
       return current_user







@app.post("/signUp/{username}/{email}/{password}")
def create_user(username,email, password, db: Session = Depends(get_db)):
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
            detail=f"Incorrect username",
            headers={"WWW-Authenticate": "Bearer"},
            )
    password = form_data.password
    if not verify_password(password, user.hashed_password) :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
            )
            
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
    data={"sub": user.username},expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

    
@app.post("/users/items/{title}/{price}/{description}", response_model=Item)
def create_item_for_user( item:Item, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db), ):
    #db_item = db.query(models.Item).filter(models.Item.title==item.title).first()
    user_id = current_user.id
    new_item = models.Item(title=item.title, price=item.price, description= item.description, owner_id=user_id)
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


@app.post('/uploadfile')
async def upload(file:UploadFile = File(...)):
    contents = await file.read()
    print(contents)
    

@app.post("/admin/items", response_model=Item)
def create_item_for_all_user( 
     item:Item, db: Session = Depends(get_db)):
    new_item = models.Item(title=item.title, price=item.price, description= item.description, owner_id=4)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item



@app.delete("/delete/admin/{item_id}")
def delete_item_for_all(
     item_id:int, db: Session = Depends(get_db)):

    db_check_for_item_id = db.query(models.Item).filter(models.Item.id==item_id).first()
    if db_check_for_item_id is None :
        raise HTTPException(status_code=400, detail="item does not exist")

    db_check_for_user_id = db.query(models.User.id).filter(models.User.id==4).first()
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


@app.get("/allitems/", response_model=List[Item])
def read_items_for_all_user(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
   return db.query(models.Item).filter(models.Item.owner_id==4).all()

@app.get("/users/me")
async def read_users_me(current_user : User = Depends(get_current_active_user)):
    return current_user.id
