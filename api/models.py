from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

from sqlalchemy import Column, Integer, String, Boolean, DATETIME
from sqlalchemy.dialects.postgresql import JSON, ARRAY

from config import DATABASE_URL

engine = create_engine(DATABASE_URL)

Base = declarative_base()

class election(Base):
    __tablename__ = 'election'
    id = Column(Integer, primary_key = True)
    questions = Column(ARRAY(Integer))
    hasVoted = Column(JSON) # ids of users who have voted in this election w/ timestamp
    active = Column(Boolean)
    creator = Column(Integer)
    deadline = Column(DATETIME)

class question(Base):
    __tablename__ = 'question'
    id = Column(Integer, primary_key = True)
    question = Column(String)
    votes = Column(JSON)


class user(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key = True)
    userName = Column(String)
    uuid = Column(Integer)
    canVote = Column(ARRAY(Integer)) # id numbers of whitelisted elections
    boardMember = Column(Boolean)
    email = Column(String)

