from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean

Base = declarative_base()

class votes(Base):
   __tablename__ = 'votes'
   id = Column(Integer, primary_key = True)
   choice = Column(String)

class users(Base):
   __tablename__ = 'users'
   id = Column(Integer, primary_key = True)
   userName = Column(String)
   hasVoted = Column(Boolean)