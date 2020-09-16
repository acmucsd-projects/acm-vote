from . import app
from . import models
from config import TOKEN, MEMBERSHIP_API
import json
import requests

@app.route('/api/user/login', methods=['POST'])
def getVoterlogin():

    r = request.get(MEMBERSHIP_API + "", headers=TOKEN)
    return json.dump(r.json())

@app.route('/api/user/<string:uuid>', methods=['GET'])
def getVoterInfo(uuid):
    r = request.get(MEMBERSHIP_API + "api/v1/user/", headers=TOKEN)
    return json.dump(r.json())

'''
{
    name:"",
    description:"",
    questions:{
        "insert_question_here":{
            answers:["answer1","answer2","answer3"],
            type:""
        },
        "insert_question_here":{
            answers:["answer1","answer2","answer3"],
            type:""
        },
    }
    ,
    users:[list here],
    creator:[ID here],
    deadline:[datetime here]
}
'''
@app.route('/api/election', methods=['POST'])
def createNewElection():
    data = request.form.toJson()
    for q in data['questions']:
      quest = q

    elect = Election(name=request.form['name'], description=request.form['description'], )

@app.route('/api/election', methods=['GET'])
def getElections():
    return json.dumps(Election.query.all())

@app.route('/api/election/<int:uuid>', methods=['GET'])
def getElection(uuid):
    return json.dumps(Elections.query.filter_by(id=uuid))

@app.route('/api/election/<int:uuid>', methods=['DELETE'])
def deleteElection(uuid):
    election = Elections.query.filter_by(id=uuid)
    if(election['active'] == true):
        return "ERROR - Cannot delete active election"
    
    else:
        db.session.delete(election)
        db.session.commit()

@app.route('/api/election/<int:uuid>', methods=['PATCH'])
def editElection(uuid):
    election = Elections.query.filter_by(id=uuid)
    if(election['active'] == true):
        return "ERROR - Cannot edit active election"
    
    else:
        
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    election = Elections.query.filter_by(id=uuid)
    if(election['active'] == true):
        return "ERROR - Already active election"
    
    else:

@app.route('/api/election/<int:uuid>/vote', methods=['POST'])
def voteElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/results', methods=['GET'])
def getElectionResults(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/audit', methods=['GET'])
def auditElectionResults(uuid):
    return "Hello, World!"