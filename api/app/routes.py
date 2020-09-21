from . import app, db
from models import Question,Election, User
from config import TOKEN, MEMBERSHIP_API
import json
import requests
import datetime

@app.route('/api/user/login', methods=['POST'])
def getVoterlogin():
    r = requests.get(MEMBERSHIP_API + "", headers = {"Authorization": f"Bearer {TOKEN}"})
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
    for q, d in data['questions'].items():
        answers = {d['answers'][i]:0 for i in range(0, len(q['answers']), 1)}

        quest = Question(question=q, votes=answers, voteType=d['type'])

        db.session.add(quest)
        db.session.commit()
        result.append(quest.id)
    
    dInfo =data['deadline']
    date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

    elect = Election(name=data['name'], description=data['description'], questions=questions, hasVoted=[],active=false, creator=data['creator'], deadline=date)
    db.session.add(elect)
    db.session.commit()

    electID = elect.id

    for u in data['users']:
        user = User.query.filter_by(id=u).first()
        user.canVote.append(electID)
        db.session.commit()

@app.route('/api/election', methods=['GET'])
def getElections():
    return json.dumps(Election.query.all())

@app.route('/api/election/<int:uuid>', methods=['GET'])
def getElection(uuid):
    elect = Elections.query.filter_by(id=uuid)
    que = []
    for i in range(0, len(elect['questions'])):
        q = Question.query.filter_by(id=elect['question'][i])
        que.append(q)
    
    result = {
        election: elect,
        questions: que
    }
    return json.dumps(result)

@app.route('/api/election/<int:uuid>', methods=['DELETE'])
def deleteElection(uuid):
    election = Elections.query.filter_by(id=uuid).first()
    if(election['active'] == true):
        return "ERROR - Cannot delete active election"
    
    else:
        for i in election['questions']:
            quest = Question.query.filter_by(id=i).first()
            db.session.delete(quest)
        
        db.session.delete(election) #delete questions?
        db.session.commit()

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
    election = Elections.query.filter_by(id=uuid)

    if(election['active'] == true):
        return "ERROR - Cannot edit active election"

    else:
        if(data['name'] != None):
            election.name = data['name']
        
        if(data['description'] != None):
            election.name = data['description']

        if(data['deadline'] != None):
            dInfo =data['deadline']
            date = datetime.datetime(dInfo[0],dInfo[1],dInfo[2],minute=dInfo[3],hour=dInfo[4])

            election.date = date

        for d in data['questions']:
            if(d['type'] == 'A'):
                answers = {d['answers'][i]:0 for i in range(0, len(q['answers']), 1)}
                quest = Question(question=q, votes=answers, voteType=d['type'])

                db.session.add(quest)

                election['questions'].append(quest.id)

            else if(d['type'] == 'E'):
                quest = Question.query.filter_by(id=d['id']).first()
                if(d['question'] != None):
                    quest['question'] = d['question']
                
                if(d['answers'] != None):
                    quest['answers'] = {d['answers'][i]:0 for i in range(0, len(q['answers']), 1)}

                if(d['type'] != None):
                    quest['type'] = d['type']

            else if(d['type'] == 'R'):
                election['questions'].remove(d['id'])
                quest = Question.query.filter_by(id=d['id']).first()
                db.session.delete(quest)
    
    db.session.commit()

@app.route('/api/election/<int:uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    election = Elections.query.filter_by(id=uuid).first()
    if(election['active'] == true):
        return "ERROR - Already active election"
    
    else:
        elect['active'] = True
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
    elect = Election.query.filter_by(id=uuid)
    elect['hasVoted'].append(data['user'])
    for i, a in data['questions'].items:
        quest = Question.query.filter_by(id=i).first()
        quest.answer


@app.route('/api/election/<int:uuid>/results', methods=['GET'])
def getElectionResults(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/audit', methods=['GET'])
def auditElectionResults(uuid):
    return "Hello, World!"
