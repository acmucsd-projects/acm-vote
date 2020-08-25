from app import db
from sqlalchemy.dialects.postgresql import JSON, ARRAY

class election(db.Model):
    __tablename__ = 'election'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    questions = db.Column(ARRAY(db.Integer))

    hasVoted = db.Column(JSON) # ids of users who have voted in this election w/ timestamp

    active = db.Column(db.Boolean)
    creator = db.Column(db.Integer)
    deadline = db.Column(db.DateTime)

class question(db.Model):
    __tablename__ = 'question'

    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String)
    votes = db.Column(JSON) # Options and results
    voteType = db.Column(db.String) # Proportional vs SPTP vs Ranked


class user(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key = True)
    userName = db.Column(db.String)

    uuid = db.Column(db.Integer)

    canVote = db.Column(ARRAY(db.Integer)) # id numbers of whitelisted elections

    boardMember = db.Column(db.Boolean)
    email = db.Column(db.String)

