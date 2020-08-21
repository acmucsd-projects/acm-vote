from . import app


@app.route('/api/user/<uuid>', methods=['GET'])
def getVoterInfo(uuid):
    return "Hello, World!"

@app.route('/api/election', methods=['POST'])
def createNewElection():
    return "Hello, World!"

@app.route('/api/election', methods=['GET'])
def getAllElections():
    return "Hello, World!"

@app.route('/api/election/<uuid>', methods=['GET'])
def getElections(uuid):
    return "Hello, World!"

@app.route('/api/election/<uuid>', methods=['DELETE'])
def deleteElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<uuid>', methods=['PATCH'])
def editElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<uuid>/activate', methods=['PUT'])
def activateElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<uuid>/vote', methods=['PUT'])
def voteElection(uuid):
    return "Hello, World!"

@app.route('/api/election/<uuid>/result', methods=['PUT'])
def getElectionResults(uuid):
    return "Hello, World!"