from app.models import db, User, Election, Question
from app.config import TEST_SERVER, MEMBERSHIP_API, SEED_DATA, TOKEN
import json
import requests
import datetime

db.drop_all()
db.create_all()

if(SEED_DATA):

    User.query.delete()
    db.session.commit()
    print(TOKEN)
    r = requests.get(MEMBERSHIP_API + 'api/v1/leaderboard', headers = TOKEN)

    print(r.status_code)
    print(r.json())

    leaderboard_user = r.json()

    users = leaderboard_user['leaderboard']

    for u in users:
        uName = u['firstName'] + " " + u['lastName']
        
        board = False #True if u['accessType'] == 'STAFF' else

        newUser = User(userName=uName, uuid="null", canVote=[], boardMember=board)
        db.session.add(newUser)
    db.session.commit()

    if(TEST_SERVER):
        Election.query.delete()
        Question.query.delete()
        db.session.commit()


        q1 = Question(question="q1", votes='{ "q1answer1":0, "q1answer2":0 }', voteType="SPTP")
        q2 = Question(question="q2", votes='{ "q2answer1":0, "q2answer2":0 }', voteType="Proportional")
        q3 = Question(question="q2", votes='{ "q2answer1":0, "q2answer2":0 }', voteType="SPTP")

        db.session.add_all([q1,q2,q3])
        db.session.commit()


        q1ID = Question.query.filter_by(question="q1").first().id
        q2ID = Question.query.filter_by(question="q2").first().id
        q3ID = Question.query.filter_by(question="q2").first().id
        
        e1 = Election(name='e1', description='test1', questions=[q1ID, q2ID], hasVoted=[], active=False, creator=-1, deadline=datetime.datetime(2025, 5, 17))
        e2 = Election(name='e1', description='test1', questions=[q3ID], hasVoted=[], active=False, creator=-1, deadline=datetime.datetime(2025, 5, 17))

        db.session.add_all([e1,e2])
        db.session.commit()









