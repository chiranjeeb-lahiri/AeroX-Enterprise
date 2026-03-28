from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # 'user' or 'admin'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Flight(Base):
    __tablename__ = "flights"

    id = Column(String, primary_key=True, index=True) # e.g., AI-101
    airline = Column(String)
    source = Column(String)
    destination = Column(String)
    depart_time = Column(String)
    arrival_time = Column(String)
    duration = Column(String)
    base_price = Column(Float)
    total_seats = Column(Integer, default=180)
    seats_booked = Column(Integer, default=0)

class Booking(Base):
    __tablename__ = "bookings"

    pnr = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True)
    flight_id = Column(String)
    source = Column(String)
    destination = Column(String)
    airline = Column(String)
    travel_date = Column(String)
    total_paid = Column(Float)
    passenger_name = Column(String)
    status = Column(String, default="CONFIRMED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)