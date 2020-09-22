from . import app, db
from .models import Question,Election, User
from .config import TOKEN, MEMBERSHIP_API
from flask import jsonify, request
import json
import requests
import datetime

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
    
    r = requests.post(MEMBERSHIP_API + 'api/v1/auth/login', data = json.dumps(payload), headers=headers)

    return json.dump(r.json())

@app.route('/api/user/<string:uuid>', methods=['GET'])
def getVoterInfo(uuid):
    r = requests.get(MEMBERSHIP_API + "api/v1/user/", headers = {"Authorization": f"Bearer {TOKEN}"})
    return json.dump(r.json())

#{
#    name:"",
#    description:"",
#    questions:{
#        "insert_question_here":{
#            answers:["answer1","answer2","answer3"],
#            type:""
#        },
#        "insert_question_here":{
#            answers:["answer1","answer2","answer3"],
#            type:""
#        },
#    }
#    ,
#    users:[list here],
#    creator:[ID here],
#    deadline:[datetime here] (Example: [YR,MON,DAY,MIN,HR] "Numerical")
#}
@app.route('/api/election', methods=['POST'])
def createNewElection():
    data = request.json
    questions = []
    print(data)
    for q, d in data['questions'].items():
        print(d['answers'])
        answers = {d['answers'][i]:0 for i in range(0, len(d['answers']), 1)}

        quest = Question(question=q, votes=answers, voteType=d['type'])

        db.session.add(quest)
        db.session.commit()
        questions.append(quest.id)
    
    dInfo =data['deadline']
    date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

    elect = Election(name=data['name'], description=data['description'], questions=questions, hasVoted=[],active=False, creator=data['creator'], deadline=date)
    db.session.add(elect)
    db.session.commit()

    electID = elect.id

    for u in data['users']: # canVote doesn't update!!!!!!!
        user = db.session.query(User).filter_by(id=u).first()
        user.canVote.append(electID)
    db.session.commit()
    
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
        return "ERROR - Cannot delete active election"
    
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
#    questions:[
#       {
#            type:"A"     (there are three options, "A" - add, "R - remove", "E" - edit)
#            id:          (-1 if N/A)
#            question:""
#            answers:["answer1","answer2","answer3"],
#            type:""
#       },
#       {
#            type:"E"     (there are three options, "A" - add, "R - remove", "E" - edit)
#            id:          (-1 if N/A)
#            question:None
#            answers:None,
#            type:None
#       }
#    ],
#
#    addVoters:[],
#    removeVoters:[]
#}
@app.route('/api/election/<int:uuid>', methods=['PATCH'])
def editElection(uuid):
    data = request.json
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()

    if elect['active'] == True:
        return "ERROR - Cannot edit active election"

    else:
        if data['name'] != None:
            election.name = data['name']
            db.session.commit()
        
        if data['description'] != None:
            election.name = data['description']
            db.session.commit()

        if data['deadline'] != None :
            dInfo =data['deadline']
            date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

            election.date = date
            db.session.commit()

        for d in data['questions']:
            if d['type'] == 'A':
                answers = {d['answers'][i]:0 for i in range(0, len(d['answers']), 1)}
                quest = Question(question=d['question'], votes=answers, voteType=d['type'])

                db.session.add(quest)
                db.session.commit()

                election.questions.append(quest.id)
                db.session.commit()

            elif d['type'] == 'E':
                quest = Question.query.filter_by(id=d['id']).first()
                if d['question'] != None:
                    quest.question = d['question']
                
                if d['answers'] != None:
                    quest.answers = {d['answers'][i]:0 for i in range(0, len(q['answers']), 1)}

                if d['type'] != None:
                    quest.type = d['type']
                
                db.session.commit()

            elif d['type'] == 'R':
                election.questions.remove(d['id'])
                quest = Question.query.filter_by(id=d['id']).first()
                db.session.delete(quest)
                db.session.commit()
        for u in data['addVoters']:
            user = User.query.filter_by(id=u).first()
            v = user.canVote
            v.append(electID)
            user.canVote = v
            db.session.commit()

        for u in data['removeVoters']:
            user = User.query.filter_by(id=u).first()
            v = user.canVote
            v.remove(electID)
            user.canVote = v
            db.session.commit()
    
    elect = election.to_json()

    return elect

@app.route('/api/election/<int:uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()
    if elect['active'] == True:
        return "ERROR - Already active election"
    
    else:
        election.active = True
        db.session.commit()

#{
#   user:  (id#),
#   questions:{
#       id:answerChoice,
#       id:answerChoice
#   }
#}
@app.route('/api/election/<int:uuid>/vote', methods=['POST'])
def voteElection(uuid):
    data = request.json
    qID = data['questions'].values()
    elect = Election.query.filter_by(id=uuid)
    eQID = elect['questions']

    if qID.sort() != eQID.sort():
        return "ERROR - Question IDs do not match those stored for this election"


    elect['hasVoted'].append(data['user'])
    for i, a in data['questions'].items:
        quest = Question.query.filter_by(id=i).first()
        answers = json.loads(quest.votes)
        answers[a] += 1
        quest.votes = json.dumps(answers)
    db.session.commit()

@app.route('/api/election/<int:uuid>/results', methods=['GET'])
def getElectionResults(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/audit', methods=['GET'])
def auditElectionResults(uuid):
    return "Hello, World!"
