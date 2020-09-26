from . import app, db
from .models import Question, Election, User
from .config import TOKEN, MEMBERSHIP_API
from flask import jsonify, request
from sqlalchemy.orm.attributes import flag_modified
import json
import requests
import datetime
import dateutil.parser
import jwt
import pyrankvote
from pyrankvote import Candidate, Ballot


@app.route("/api/user/login", methods=["POST"])
def getVoterLogin():
    data = request.json

    headers = {"Content-Type": "application/json"}
    payload = {"email": data["email"], "password": data["password"]}

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/login", data=json.dumps(payload), headers=headers
    ).json()

    if r["error"] != None:
        return jsonify(r), 500

    claim = jwt.decode(r["token"], verify=False)

    # Checking User Database
    result = User.query.filter_by(uuid=claim["uuid"]).first()

    if result == None:
        info = requests.get(
            MEMBERSHIP_API + "api/v1/user/" + claim["uuid"],
            headers={"Authorization": f"Bearer {r['token']}"},
        )
        uName = info.json()["user"]["firstName"] + " " + info.json()["user"]["lastName"]

        newUser = User(
            userName=uName, uuid=claim["uuid"], canVote=[], boardMember=False
        )

        db.session.add(newUser)
        db.session.commit()

    return jsonify(r)


@app.route("/api/user/<string:uuid>", methods=["GET"])
def getVoterInfo(uuid):

    if "Authorization" not in request.headers:
        return "ERROR - No Authorization token provided", 401

    r = requests.get(
        MEMBERSHIP_API + "api/v1/user/" + uuid,
        headers={"Authorization": request.headers["Authorization"]},
    )

    return jsonify(r.json())


@app.route("/api/user", methods=["GET"])
def getAllVoters():
    # Return all the Users from the database
    users = User.query.all()

    # Create new list, to only returns their ID and their name
    result = list(map(lambda x: {"id": x.id, "name": x.userName}, users))

    return jsonify(result)


# {
#    name:"",
#    description:"",
#    questions:{                    ######## FPTP
#        {
#            "question1":{
#                answers:{
#                   "test1":{"description": null},
#                   "test2":{"description": null},
#                   "test3":{"description": null}
#                },
#                "type":"FPTP"
#            },
#            "question2":{
#                answers:{
#                   "test1":{"description": null},
#                   "test2":{"description": null},
#                   "test3":{"description": null}
#                },
#                "type":"FPTP"
#            }
#        }
#    },
#    users:[list here],
#    deadline:[datetime here] ISO format
# }
#
# STV---------------------------------------
#    questions:{
#        "question":{
#            "answers": [{"name": "test1", "description": null}, {"name": "test2", "description": null}, {"name": "test3", "description": null}],
#            "type":"STV"
#         }
#    }
#
@app.route("/api/election", methods=["POST"])
def createNewElection():

    head = request.headers

    if "Authorization" not in head:
        return "ERROR - Bearer Token not found", 401

    auth = head["Authorization"]

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    tok = auth.split(" ")[1]
    claim = jwt.decode(tok, verify=False)

    # Checking User Database
    user = User.query.filter_by(uuid=claim["uuid"]).first()

    if user == None:
        return "ERROR - Claimed user not found", 403

    data = request.json
    questions = []
    for q, d in data["questions"].items():
        quest = None
        if d["type"] == "FPTP":
            que = {
                i: {"description": d["description"], "count": 0}
                for i, d in d["answers"].items()
            }
            votes = {"answers": que, "results": None, "audit": None}
            quest = Question(question=q, votes=votes, voteType=d["type"])
        elif d["type"] == "STV":
            votes = {
                "answers": d["answers"],
                "ballots": list(),
                "results": None,
                "audit": None,
            }
            quest = Question(question=q, votes=votes, voteType=d["type"])

        db.session.add(quest)
        db.session.commit()
        questions.append(quest.id)

    date = dateutil.parser.parse(data["deadline"])

    elect = Election(
        name=data["name"],
        description=data["description"],
        questions=questions,
        hasVoted=[],
        active=False,
        creator=user.id,
        deadline=date,
    )
    db.session.add(elect)
    db.session.flush()
    db.session.refresh(elect)

    electID = elect.id

    if data["users"] == [0]:
        users = User.query.all()

        def addElectionFromUserVoteList(x):
            x.canVote = x.canVote + [elect.id]
            return x

        users = map(addElectionFromUserVoteList, users)
        db.session.add_all(users)
        db.session.flush()

    else:
        for u in data["users"] + [user.id]:
            user = db.session.query(User).filter_by(id=u).first()

            v = user.canVote.copy()
            v.append(electID)
            user.canVote = v

            db.session.add(user)
            db.session.flush()

    db.session.commit()
    db.session.refresh(elect)
    return jsonify(elect.to_json())


@app.route("/api/election", methods=["GET"])
def getElections():

    head = request.headers

    if "Authorization" not in head:
        return "ERROR - Bearer Token not found", 401

    auth = head["Authorization"]

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    tok = auth.split(" ")[1]
    claim = jwt.decode(tok, verify=False)

    # Checking User Database
    user = User.query.filter_by(uuid=claim["uuid"]).first()

    if user == None:
        return "ERROR - Claimed user not found", 403

    elects = db.session.query(Election).filter(
        Election.id.in_(user.canVote), Election.active == True
    )
    result = [x.to_json() for x in elects]
    drafts = db.session.query(Election).filter(
        Election.creator == user.id, Election.active == False
    )
    result += [x.to_json() for x in drafts]
    return jsonify(result)


@app.route("/api/election/<int:uuid>", methods=["GET"])
def getElection(uuid):
    elect = Election.query.filter_by(id=uuid).first().to_json()
    que = list()
    for i in range(0, len(elect["questions"])):
        q = Question.query.filter_by(id=elect["questions"][i]).first()
        que.append(q.to_json())

    result = {"election": elect, "questions": que}
    return jsonify(result)


@app.route("/api/election/<int:uuid>", methods=["DELETE"])
def deleteElection(uuid):
    election = Election.query.filter_by(id=uuid).first()
    elect = election.to_json()
    if elect["active"] == True:
        return "ERROR - Cannot delete active election", 403

    else:
        q = list()
        for i in elect["questions"]:
            quest = Question.query.filter_by(id=i).first()
            q.append(quest.to_json())
            db.session.delete(quest)

        db.session.delete(election)
        db.session.commit()

        result = {"election": elect, "questions": q}
        return jsonify(result)


# Note: Generally leave items None if no change, else, the value is replaced
# {
#    name:None,
#    description:None,
#    deadline:None [YR,MON,DAY,MIN,HR] "Numerical",
#
#    questions:{        #### See create task for the format - include "id":## if editing an existing question,anything you dont want to change while editing, leave null
#    }
#
#    voters:[]
# }
@app.route("/api/election/<int:uuid>", methods=["PATCH"])
def editElection(uuid):
    if "Authorization" not in request.headers:
        return "ERROR - Bearer Token not found", 401

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    data = request.json
    election = Election.query.filter_by(id=uuid).first()
    if election == None:
        return "ERROR - Election does not exist", 404

    elect = election.to_json()

    tok = request.headers["Authorization"].split(" ")[1]
    claim = jwt.decode(tok, verify=False)
    creator = User.query.filter_by(id=elect["creator"]).first()

    if elect["active"] == True:
        return "ERROR - Cannot edit active election", 403
    elif creator.uuid != claim["uuid"]:
        return "ERROR - You are not the creator of this election", 403

    else:
        if data["name"] != None:
            election.name = data["name"]

            db.session.add(election)
            db.session.flush()
            db.session.refresh(election)

        if data["description"] != None:
            election.description = data["description"]

            db.session.add(election)
            db.session.flush()
            db.session.refresh(election)

        if data["deadline"] != None:
            date = dateutil.parser.parse(data["deadline"])

            election.date = date

            db.session.add(election)
            db.session.flush()
            db.session.refresh(election)

        qID = list()
        for q, d in data["questions"].items():
            if "id" not in d.keys():
                quest = None
                if d["type"] == "FPTP":
                    questions = {
                        q: {"description": d["description"], "count": 0}
                        for i, d in d["answers"].items()
                    }
                    votes = {"answers": questions, "results": None, "audit": None}
                    quest = Question(question=q, votes=votes, voteType=d["type"])
                elif d["type"] == "STV":
                    votes = {
                        "answers": d["answers"],
                        "ballots": list(),
                        "results": None,
                        "audit": None,
                    }
                    quest = Question(question=q, votes=votes, voteType=d["type"])

                db.session.add(quest)
                db.session.flush()
                db.session.refresh(quest)

                q = election.questions.copy()
                q.append(quest.id)

                qID.append(quest.id)

            else:
                quest = Question.query.filter_by(id=d["id"]).first()
                if d["question"] != None:
                    quest.question = d["question"]

                    db.session.add(quest)
                    db.session.flush()
                    db.session.refresh(quest)

                if d["type"] != None:
                    quest.type = d["type"]

                    db.session.add(quest)
                    db.session.flush()
                    db.session.refresh(quest)

                if d["answers"] != None:
                    votes = None
                    if quest.voteType == "FPTP":
                        questions = {
                            i: {"description": da["description"], "count": 0}
                            for i, da in d["answers"].items()
                        }
                        votes = {"answers": questions, "results": None, "audit": None}
                        quest = Question(question=q, votes=votes, voteType=d["type"])
                    elif quest.voteType == "STV":
                        votes = {
                            "answers": d["answers"],
                            "ballots": list(),
                            "results": None,
                            "audit": None,
                        }

                    quest.answers = votes

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

        rUsers = db.session.query(User).filter(
            User.canVote.contains([uuid]), ~User.id.in_(data["voters"] + [creator.id])
        )
        aUsers = db.session.query(User).filter(
            ~User.canVote.contains([uuid]), User.id.in_(data["voters"] + [creator.id])
        )

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

    return jsonify(elect)


@app.route("/api/election/<int:uuid>/activate", methods=["PUT"])
def activateElection(uuid):
    if "Authorization" not in request.headers:
        return "ERROR - Bearer Token not found", 401

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    election = Election.query.filter_by(id=uuid).first()
    if election == None:
        return "ERROR - Election does not exist", 404

    elect = election.to_json()

    tok = request.headers["Authorization"].split(" ")[1]
    claim = jwt.decode(tok, verify=False)
    creator = User.query.filter_by(id=elect["creator"]).first()

    if creator.uuid != claim["uuid"]:
        return "ERROR - You are not the creator of this election", 403

    if elect["active"] == True:
        return "ERROR - Already active election", 403

    else:
        election.active = True
        db.session.commit()
        db.session.refresh(election)
        return "Success! Election " + str(election.id) + " activated", 200


# FPTP
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
@app.route("/api/election/<int:uuid>/vote", methods=["POST"])
def voteElection(uuid):
    head = request.headers
    auth = head["Authorization"]
    tok = auth.split(" ")[1]

    info = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )

    k = info.json()["authenticated"]

    if k == False:
        return "ERROR - User did not authenticate properly", 401

    elect = Election.query.filter_by(id=uuid).first()

    if elect == None:
        return "ERROR - Election not found", 404

    if elect.active == False:
        return "ERROR - Election not active", 403

    claim = jwt.decode(tok, verify=False)

    user = User.query.filter_by(uuid=claim["uuid"]).first()

    if user == None:
        return "ERROR - Claimed user not found", 403

    if uuid not in user.canVote:
        return "ERROR - User is not allowed to vote for election", 403

    if user.id in elect.hasVoted:
        return "ERROR - User has voted for election", 403

    currentTime = datetime.datetime.now()
    if currentTime > elect.deadline:
        return (
            "ERROR - Deadline to vote for election has passed! Check the results!",
            403,
        )

    data = request.json
    qID = list(map(lambda x: int(x), list(data.keys())))
    e = elect.to_json()
    eQID = e["questions"]

    if qID.sort() != eQID.sort():
        return "ERROR - Question IDs do not match those stored for this election", 400

    elect.hasVoted = elect.hasVoted + [user.id]

    db.session.add(elect)
    db.session.flush()

    for i, a in data.items():
        quest = db.session.query(Question).filter_by(id=int(i)).first()
        answers = quest.votes.copy()

        if quest.voteType == "FPTP":
            answers["answers"][a]["count"] += 1
        elif quest.voteType == "STV":
            answers["ballots"] = answers["ballots"] + [a]

        quest.votes = answers
        flag_modified(quest, "votes")

        db.session.add(quest)
        db.session.flush()

    db.session.commit()
    return "Vote Stored!", 200


@app.route("/api/election/<int:uuid>/results", methods=["GET"])
def getElectionResults(uuid):
    head = request.headers

    if "Authorization" not in head:
        return "ERROR - Bearer Token not found", 401

    auth = head["Authorization"]

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    tok = auth.split(" ")[1]
    claim = jwt.decode(tok, verify=False)

    # Checking User Database
    user = User.query.filter_by(uuid=claim["uuid"]).first()

    if uuid not in user.canVote:
        return "ERROR - User not allowed to access this election", 403

    elect = Election.query.filter_by(id=uuid).first()

    if elect.active == False:
        return "ERROR - Election is not active yet", 403

    currentTime = datetime.datetime.now()
    if currentTime < elect.deadline:
        return "ERROR - Deadline to vote for election has not passed yet! Go vote!", 403

    q = Question.query.filter_by(id=elect.questions[0]).first()

    if q.votes["results"] == None:
        calculateElectionResults(elect)

    result = dict()
    for i in elect.questions:
        q = Question.query.filter_by(id=i).first()
        result.update({q.question: {"winner": q.votes["results"]}})

    return jsonify(result)


@app.route("/api/election/<int:uuid>/audit", methods=["GET"])
def auditElectionResults(uuid):
    head = request.headers

    if "Authorization" not in head:
        return "ERROR - Bearer Token not found", 401

    auth = head["Authorization"]

    r = requests.post(
        MEMBERSHIP_API + "api/v1/auth/verification",
        headers={"Authorization": request.headers["Authorization"]},
    )
    if r.json()["authenticated"] == False:
        return "ERROR - invalid JWT", 403

    tok = auth.split(" ")[1]
    claim = jwt.decode(tok, verify=False)

    # Checking User Database
    user = User.query.filter_by(uuid=claim["uuid"]).first()

    if uuid not in user.canVote:
        return "ERROR - User not allowed to access this election", 403

    elect = Election.query.filter_by(id=uuid).first()

    if elect.active == False:
        return "ERROR - Election is not active yet", 403

    currentTime = datetime.datetime.now()
    if currentTime < elect.deadline:
        return "ERROR - Deadline to vote for election has not passed yet! Go vote!", 403

    q = Question.query.filter_by(id=elect.questions[0]).first()

    if q.votes["results"] == None:
        calculateElectionResults(elect)

    result = dict()
    for i in elect.questions:
        q = Question.query.filter_by(id=i).first()
        result.update({q.question: {"audit": q.votes["audit"]}})

    return jsonify(result)


#
#                answers:{
#                   "test1":{"description": null, count:0},
#                   "test2":{"description": null, count:0},
#                   "test3":{"description": null, count:0}
#                },
# Make a separate func for calculating votes here
def calculateElectionResults(election):
    for i in election.questions:
        q = Question.query.filter_by(id=i).first()
        if q.voteType == "FPTP":
            winnerVote = {"first": {"description": "", "count": 0}}
            ties = list()
            for name, details in q.votes["answers"].items():
                if details["count"] > winnerVote[next(iter(winnerVote))]["count"]:
                    winnerVote = {name: details}
                    ties = []
                elif details["count"] == winnerVote[next(iter(winnerVote))]["count"]:
                    ties += [{name: details}]

            q.votes["results"] = [winnerVote] + ties
            audit = f"Answer {next(iter(winnerVote))} won by having highest number of votes, {winnerVote[next(iter(winnerVote))]['count']}."
            if len(ties) == 0:
                audit += " There were no ties."
            else:
                audit += f" There were ties as well: "
                for tie in ties:
                    audit += (
                        ", ".join([next(iter(tie)), str(tie[next(iter(tie))]["count"])])
                        + "; "
                    )
            q.votes["audit"] = audit

            flag_modified(q, "votes")

            db.session.add(q)
            db.session.flush()
        elif q.voteType == "STV":
            candidates = list(map(lambda x: Candidate(x["name"]), q.votes["answers"]))

            fullBallots = ballotify(q.votes["ballots"], candidates)

            results = pyrankvote.single_transferable_vote(
                candidates, fullBallots, number_of_seats=1
            )
            winner = results.get_winners()
            print(f"Winner for STV question: {winner}")
            print(f"Audit for STV question:\n{results}")

            winnerDetails = list(
                filter(lambda x: x["name"] == str(winner[0]), q.votes["answers"])
            )
            print(winnerDetails)

            q.votes["results"] = winnerDetails
            q.votes["audit"] = str(results)
            flag_modified(q, "votes")

            db.session.add(q)
            db.session.flush()
    db.session.commit()


def ballotify(ballotList, candidates):
    ballots = list()
    for l in ballotList:
        sinBal = list(map(lambda x: next(filter(lambda c: str(c) == x, candidates)), l))
        ballots.append(Ballot(sinBal))
        print(sinBal)
    return ballots
