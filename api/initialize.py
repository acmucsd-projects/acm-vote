from app.models import db, User, Election, Question
from app.config import TEST_SERVER, MEMBERSHIP_API, SEED_DATA
import datetime

db.create_all()


if(SEED_DATA):

    Question.delete()
    db.session.commit()
    
    leaderboard_user = json.loads(request.get(MEMBERSHIP_API + "api/v1/leaderboard"))

    users = leaderboard_user['leaderboard']
    for u in users:
        uName = u['firstName'] + u['lastName']
        
        board = True if u['accessType'] == 'STAFF' else False

        newUser = user(userName=uName, uuid=u['uuid'], canVote=[], boardMember=board)
        db.session.add(newUser)
    db.session.commit()

    if(TEST_SERVER):
        Election.delete()
        Question.delete()
        db.session.commit()


        q1 = Question(question="q1", votes='{ "q1answer1":0, "q1answer2":0 }', voteType="SPTP")
        q2 = Question(question="q2", votes='{ "q2answer1":0, "q2answer2":0 }', voteType="Proportional")
        q3 = Question(question="q2", votes='{ "q2answer1":0, "q2answer2":0 }', voteType="SPTP")

        db.session.add_all([q1,q2,q3])
        db.session.commit()


        q1ID = Question.query.filter_by(question="q1").first().id
        q2ID = Question.query.filter_by(question="q2").first().id
        q3ID = Question.query.filter_by(question="q2").first().id
        
        e1 = Election(name='e1', description='test1', questions=[q1ID, q2ID], hasVoted=[], active=False, creator="", deadline=datetime.datetime(2025, 5, 17))
        e2 = Election(name='e1', description='test1', questions=[q3ID], hasVoted=[], active=False, creator="", deadline=datetime.datetime(2025, 5, 17))

        db.session.add_all([e1,e2])
        db.session.commit()









