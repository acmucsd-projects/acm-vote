from . import app, db
from .models import Question,Election, User
from .config import TOKEN, MEMBERSHIP_API
from flask import jsonify, request
import json
import requests
import datetime
import jwt

@app.route('/api/user/login', methods=['POST'])
def getVoterLogin():
    data = request.json
    
    headers = {
    'Content-Type': 'application/json'
    }
    payload = {
        'email':data['email'],
        'password':data['password']
    }
    
    r = requests.post(MEMBERSHIP_API + 'api/v1/auth/login', data = json.dumps(payload), headers=headers).json()

    claim = jwt.decode(r['token'], verify=False)
    
    # Checking User Database
    result = User.query.filter_by(uuid=claim['uuid']).first()

    if(result == None):
        info = requests.get(MEMBERSHIP_API + "api/v1/user/" + uuid, headers = {"Authorization": f"Bearer {r['token']}"})
        uName = info['firstName'] + " " + info['lastName']
        
        newUser = User(userName=uName,uuid=claim['uuid'],canVote=[],boardMember=False)

        db.session.add(newUser)
        db.session.commit()

    return json.dumps(r)

@app.route('/api/user/<string:uuid>', methods=['GET'])
def getVoterInfo(uuid):

    if 'Authorization' not in request.headers:
        return "ERROR - No Authorization token provided", 401
    
    r = requests.get(MEMBERSHIP_API + "api/v1/user/" + uuid, headers = {"Authorization": request.headers["Authorization"]})

    return r.text

@app.route('/api/user', methods=['GET'])
def getAllVoters():
    # Return all the Users from the database
    users = User.query.all()

    # Create new list, to only returns their ID and their name
    result = list(map(lambda x: {'id': x.id, 'name': x.userName}, users))

    return json.dumps(result)
#{
#    name:"",
#    description:"",
#    questions:{                    ######## FPTP
#        {
#            "question1":{
#                answers:{
#                   "test1":{"description": null, "count": 0},
#                   "test2":{"description": null, "count": 0},
#                   "test3":{"description": null, "count": 0},
#                },
#                "type":"FPTP"
#            },
#            "question2":{
#                answers:{
#                   "test1":{"description": null, "count": 0},
#                   "test2":{"description": null, "count": 0},
#                   "test3":{"description": null, "count": 0},
#                },
#                "type":"FPTP"
#            }
#        }
#    },
#    users:[list here],
#    creator:[ID here],
#    deadline:[datetime here] (Example: [YR,MON,DAY,MIN,HR] "Numerical")
#}
#
# STV---------------------------------------
#    questions:{
#        "question":{
#            "votes":{
#                "answers": [{"name": "test1", "description": null}, {"name": "test2", "description": null}, {"name": "test3", "description": null}],
#                "ballots": [
#                    ["test1", "test2", "test3"],
#                    ["test2", "test1", "test3"]
#                ]
#            },
#            "type":"STV"
#         }
#    }
#
@app.route('/api/election', methods=['POST'])
def createNewElection():
    data = request.json
    questions = []
    for q, d in data['questions'].items():
        quest = None
        if d['type'] == "FPTP":
            quest = Question(question=q, votes=d['answers'], voteType=d['type'])
        elif d['type'] == "STV":
            quest = Question(question=q, votes=d['votes'], voteType=d['type'])

        db.session.add(quest)
        db.session.commit()
        questions.append(quest.id)
    
    dInfo =data['deadline']
    date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

    elect = Election(name=data['name'], description=data['description'], questions=questions, hasVoted=[],active=False, creator=data['creator'], deadline=date)
    db.session.add(elect)
    db.session.flush()
    db.session.refresh(elect)

    electID = elect.id

    if data['users'] == [0]:
        users = User.query.all()
        def addElectionFromUserVoteList(x):
            x.canVote = x.canVote + [uuid]
            return x
        users = map(addElectionFromUserVoteList, users)    
        db.session.add_all(users)
        db.session.flush()
    
    else:
        for u in data['users']:
            user = db.session.query(User).filter_by(id=u).first()

            v = user.canVote.copy()
            v.append(electID)
            user.canVote = v

            db.session.add(user)
            db.session.flush()

    db.session.commit()
    db.session.refresh(elect)
    return json.dumps(elect.to_json())

@app.route('/api/election', methods=['GET'])
def getElections():
    elects = Election.query.all()
    result = [x.to_json() for x in elects]
    return jsonify(result)

@app.route('/api/election/<int:uuid>', methods=['GET'])
def getElection(uuid):
    elect = Election.query.filter_by(id=uuid).first().to_json()
    que = list()
    for i in range(0, len(elect['questions'])):
        q = Question.query.filter_by(id=elect['questions'][i]).first()
        que.append(q.to_json())
    
    result = {
        "election": elect,
        "questions": que
    }
    return json.dumps(result)

@app.route('/api/election/<int:uuid>', methods=['DELETE'])
def deleteElection(uuid):
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()
    if elect['active'] == True:
        return "ERROR - Cannot delete active election", 403
    
    else:
        q = list()
        for i in elect['questions']:
            quest = Question.query.filter_by(id=i).first()
            q.append(quest.to_json())
            db.session.delete(quest)
        
        db.session.delete(election)
        db.session.commit()

        result = {
            "election":elect,
            "questions":q
        }
        return json.dumps(result)

# Note: Generally leave items None if no change, else, the value is replaced
# {
#    editor:10,
#    name:None,
#    description:None,
#    deadline:None [YR,MON,DAY,MIN,HR] "Numerical",
#
#    questions:{        #### See create task for the format - include "id":## if editing an existing question,anything you dont want to change while editing, leave null
#    }
#
#    voters:[]
#}
@app.route('/api/election/<int:uuid>', methods=['PATCH'])
def editElection(uuid):
    data = request.json
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()

    if elect['active'] == True:
        return "ERROR - Cannot edit active election", 403

    else:
        if data['name'] != None:
            election.name = data['name']

            db.session.add(election) 
            db.session.flush()
            db.session.refresh(election)
        
        if data['description'] != None:
            election.description = data['description']
            
            db.session.add(election) 
            db.session.flush()
            db.session.refresh(election)

        if data['deadline'] != None :
            dInfo = data['deadline']
            date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

            election.date = date

            db.session.add(election) 
            db.session.flush()
            db.session.refresh(election)

        qID = list()
        for d in data['questions']:
            if 'id' not in d.keys():
                quest = None
                if d['type'] == "FPTP":
                    quest = Question(question=q, votes=d['answers'], voteType=d['type'])
                elif d['type'] == "STV":
                    quest = Question(question=q, votes=d['votes'], voteType=d['type'])

                db.session.add(quest)
                db.session.flush()
                db.session.refresh(quest)

                q = election.questions.copy()
                q.append(quest.id)
                
                qID.append(quest.id)

            else:
                quest = Question.query.filter_by(id=d['id']).first()
                if d['question'] != None:
                    quest.question = d['question']

                    db.session.add(quest) 
                    db.session.flush()
                    db.session.refresh(quest)
                
                if d['answers'] != None:
                    quest.answers = d['answers']
                    
                    db.session.add(quest) 
                    db.session.flush()
                    db.session.refresh(quest)

                if d['type'] != None:
                    quest.type = d['type']

                    db.session.add(quest) 
                    db.session.flush()
                    db.session.refresh(quest) 

                qID.append(quest.id)

            removeQID = [i for i in election.questions if i not in qID]
            for i in removeQID:
                q = election.questions.copy()
                q.remove(i)
                election.questions = q

                db.session.flush()
                db.session.refresh(election)

                quest = Question.query.filter_by(id=i).first()

                db.session.delete(quest)
                db.session.flush()
            election.questions = qID
            db.session.flush()
            db.session.refresh(election)

        rUsers = db.session.query(User).filter(User.canVote.contains([uuid]), ~User.id.in_(data['voters']))
        aUsers = db.session.query(User).filter(~User.canVote.contains([uuid]), User.id.in_(data['voters']))
        
        def addElectionFromUserVoteList(x):
            x.canVote = x.canVote + [uuid]
            return x
        aUsers = map(addElectionFromUserVoteList, aUsers)

        db.session.add_all(aUsers) 
        db.session.flush()

        def removeElectionFromUserVoteList(x):
            x.canVote = filter(lambda y: y != uuid, x.canVote)
            return x
        rUsers = map(removeElectionFromUserVoteList, rUsers)

        db.session.add_all(rUsers) 
        db.session.flush()
    
    db.session.commit()

    db.session.refresh(election)
    elect = election.to_json()

    return json.dumps(elect)

@app.route('/api/election/<int:uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()
    if elect['active'] == True:
        return "ERROR - Already active election", 403
    
    else:
        election.active = True
        db.session.commit()

#FPTP
#    {                    ######## FPTP
#        "id":"name",
#        "id":"name",
#        
#    },
#
# STV
#    {
#        "id":["name1", "name2", "name3"],
#        "id":["name2", "name1", "name3"]
#    }
#
# Note, an election can have both STV and FPTP questions (if it has multiple questions) 
#   {
#        "id":"name",
#        "id":["name1", "name2", "name3"],
#        "id":["name2", "name1", "name3"]
#   }
#
# 
# 
@app.route('/api/election/<int:uuid>/vote', methods=['POST'])
def voteElection(uuid):
    head = request.headers
    auth = head['Authorization']
    tok = auth.split(" ")[1]

    info = requests.post(MEMBERSHIP_API + "api/v1/auth/verification", headers={"Authorization": request.headers["Authorization"]})

    k = info.json()['authenticated']

    if k == False:
        return "ERROR - User did not authenticate properly", 401


    user = User.query.filter_by(uuid=claims['uuid']).first()
    
    if uuid not in user.canVote:
        return "ERROR - User is not allowed to vote for election", 403
    

    elect = Election.query.filter_by(id=uuid).first()

    if user.id in elect.hasVoted:
        return "ERROR - User has voted for election", 403

    data = request.json
    qID = list(map(lambda x: int(x), list(data['questions'].keys())))
    e = elect.to_json()
    eQID = e['questions']

    if qID.sort() != eQID.sort():
        return "ERROR - Question IDs do not match those stored for this election", 400

    elect.hasVoted += [user.id]

    for i, a in data.items():
        quest = Question.query.filter_by(id=int(i)).first()
        answers = quest.votes

        if quest.voteType == "FPTP":
            answers[a]['count'] += 1
        elif quest.voteType == "STV":
            answers['ballots'] += a

        quest.votes = json.dumps(answers)
        db.session.add(quest)
        db.session.flush()

    db.session.commit()

    return "Vote Stored!",200

@app.route('/api/election/<int:uuid>/results', methods=['GET'])
def getElectionResults(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/audit', methods=['GET'])
def auditElectionResults(uuid):
    return "Hello, World!"
