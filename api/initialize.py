from app.models import db, User, Election, Question
from app.config import TEST_SERVER, MEMBERSHIP_API, SEED_DATA, TOKEN
import json
import requests
import datetime

db.drop_all()
db.create_all()

if SEED_DATA :

    User.query.delete()
    db.session.commit()
    r = requests.get(MEMBERSHIP_API + 'api/v2/leaderboard', headers = {"Authorization": f"Bearer {TOKEN}"})


    leaderboard_user = r.json()
    users = leaderboard_user['leaderboard']

    for u in users:
        uName = u['firstName'] + " " + u['lastName']

        board = False

        newUser = User(userName=uName, uuid=u['uuid'], canVote=[], boardMember=board)
        db.session.add(newUser)
    db.session.commit()

    if TEST_SERVER:
        Election.query.delete()
        Question.query.delete()
        db.session.commit()


        q1 = Question(question="q1", votes='{ "questions"{"q1answer1":{"description":null,"count":0}, "q1answer2":{"description":null,"count":0}},"results":null,"audit":null }', voteType="FPTP")
        q2 = Question(question="q2", votes='{ "answers": [{"name": "q2answer1", "description": null}, {"name": "q2answer2", "description": null}, {"name": "q2answer3", "description": null}], "ballots":[],"results":null,"audit":null}', voteType="STV")
        q3 = Question(question="q3", votes='{ "questions"{"q3answer1":{"description":null,"count":0}, "q3answer2":{"description":null,"count":0}},"results":null,"audit":null }', voteType="FPTP")

        db.session.add_all([q1,q2,q3])
        db.session.commit()


        q1ID = Question.query.filter_by(question="q1").first().id
        q2ID = Question.query.filter_by(question="q2").first().id
        q3ID = Question.query.filter_by(question="q3").first().id
        
        e1 = Election(name='e1', description='test1', questions=[q1ID, q2ID], hasVoted=[], active=False, creator=-1, deadline=datetime.datetime(2025, 5, 17))
        e2 = Election(name='e2', description='test2', questions=[q3ID], hasVoted=[], active=False, creator=-1, deadline=datetime.datetime(2025, 5, 17))

        db.session.add_all([e1,e2])
        db.session.commit()
