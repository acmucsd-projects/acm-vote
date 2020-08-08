from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

from models.py import {votes, users}

engine = create_engine(DATABASE_URI)

Base = declarative_base()

Base.metadata.create_all(engine)