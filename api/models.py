from initialize import Base
from sqlalchemy import Column, Integer, String, Boolean



class votes(Base):
   __tablename__ = 'votes'
   id = Column(Integer, primary_key = True)
   choice = Column(String)

class users(Base):
   __tablename__ = 'users'
   id = Column(Integer, primary_key = True)
   userName = Column(String)
   hasVoted = Column(Boolean)