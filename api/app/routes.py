from . import app
from . import models
import json

@app.route('/api/user', methods=['GET'])
def getAllVoters():
    return json.dump(User.query.all())

@app.route('/api/user/<int:uuid>', methods=['GET'])
def getVoterInfo(uuid):
    return json.dump(User.query.filter_by(id=uuid).first())

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
   return "Hello World!"

@app.route('/api/election', methods=['GET'])
def getAllElections():
    return "Hello, World!"

@app.route('/api/election/<int:uuid>', methods=['GET'])
def getElections(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>', methods=['DELETE'])
def deleteElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>', methods=['PATCH'])
def editElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/vote', methods=['POST'])
def voteElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/results', methods=['GET'])
def getElectionResults(uuid):
    return "Hello, World!"

@app.route('/api/election/<int:uuid>/audit', methods=['GET'])
def auditElectionResults(uuid):
    return "Hello, World!"