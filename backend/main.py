from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database, auth
import random

app = FastAPI(title="AeroX Enterprise API")

# BULLETPROOF CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BookingCreate(BaseModel):
    pnr: str
    source: str
    destination: str
    airline: str
    date: str
    totalPaid: float
    passengerName: str
    passengerEmail: str

@app.post("/api/register")
def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/api/login")
def login_user(user: UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer", "name": db_user.name, "email": db_user.email}

@app.get("/api/flights")
def get_flights(source: str, destination: str, date: str = None):
    airlines = ["Air India", "IndiGo", "Vistara", "Emirates", "British Airways"]
    times = ["06:30 AM", "10:15 AM", "02:45 PM", "08:00 PM", "11:30 PM"]
    durations = ["2h 15m", "3h 45m", "1h 50m", "4h 20m"]
    
    flights = []
    for i in range(5):
        flights.append({
            "id": f"{random.choice(['AI', '6E', 'UK', 'EK', 'BA'])}-{random.randint(100, 999)}",
            "airline": random.choice(airlines),
            "source": source.upper(),
            "destination": destination.upper(),
            "depart": random.choice(times),
            "duration": random.choice(durations),
            "price": random.randint(4500, 18000),
            "date": date
        })
    return sorted(flights, key=lambda x: x["price"])

@app.post("/api/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(database.get_db)):
    db_booking = models.Booking(
        pnr=booking.pnr,
        user_email=booking.passengerEmail,
        source=booking.source,
        destination=booking.destination,
        airline=booking.airline,
        travel_date=booking.date,
        total_paid=booking.totalPaid,
        passenger_name=booking.passengerName
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return {"status": "success", "pnr": db_booking.pnr}

@app.get("/api/bookings")
def get_user_bookings(email: str, db: Session = Depends(database.get_db)):
    return db.query(models.Booking).filter(models.Booking.user_email == email).all()

@app.delete("/api/bookings/{pnr}")
def cancel_booking(pnr: str, db: Session = Depends(database.get_db)):
    booking = db.query(models.Booking).filter(models.Booking.pnr == pnr).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"status": "cancelled", "pnr": pnr}