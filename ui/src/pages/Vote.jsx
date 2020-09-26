import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout/PageLayout';
import PollVoteHome from '../components/PollVoteHome/PollVoteHome';
import PollVoteMain from '../components/PollVoteMain/PollVoteMain';
import ViewResults from './ViewResults';
import hardCodedPoll from '../data/HardCodedPoll.json';
import API from '../API';
import { notification } from 'antd';
import './style.css';

const Vote = () => {
    const { uuid } = useParams();
    const [currPage, setCurrPage] = useState(0);
    const [election, setElection] = useState({});
    const [orderedOptions, setOrderedOptions] = useState([]);
    
    useEffect(() => {
        API.getPoll(uuid)
            .then((response) => {
                const fetchedElection = response.data.election;
                fetchedElection.questions = response.data.questions;
                if (response.data.questions[0].voteType == "FPTP") {
                    const answers = { ...fetchedElection.questions[0].votes.answers};
                    const answersList = Object.keys(answers).map((answerName, ind) => {
                        return {
                            id: ind,
                            name: answerName,
                            description: answers[answerName].description,
                            votes: answers[answerName].count,
                        };
                    });
                    fetchedElection.questions[0].votes.answers = answersList;
                    console.log("Fetched response: ", fetchedElection);
                } else if (response.data.questions[0].voteType == "STV") {
                    fetchedElection.questions[0].votes.answers = fetchedElection.questions[0].votes.answers.map((answer, ind) => {
                        return {
                            id: ind,
                            ...answer
                        };
                    })
                }
                console.log("About to update election state");
                setElection(fetchedElection);
            }).catch((error) => {
                if (error.status_code === 403) {
                    notification.open(
                        {
                            key: "no-voting-permission",
                            message: "No Permission",
                            description: "You don't have permission to vote in this poll. Click on this to go to the home page.",
                            onClick: () => {
                                window.location.href = "/";
                            }
                        }
                    )
                }
            })
    }, [])

    // I probably can't use the const {name, description} = election here
    // Because JavaScript does have restrictions with the use of "name"

    /* Render the corresponding page depending on the current state */
    const pageContent = currPage === 0 ?
        <PollVoteHome pollTitle={election.name} pollId={election.id}
            pollDescription={election.description} deadline={election.deadline}
            setCurrPage={setCurrPage} /> : currPage === 1 ?
            <PollVoteMain pollID={election.id} pollTitle={election.name} pollDescription={election.description}
                questionID={election.questions[0].id}
                pollOptions={election.questions[0].votes.answers} deadline={election.deadline}
                pollType={election.questions[0].voteType} setCurrPage={setCurrPage} /> :
            <ViewResults pollTitle={election.name} pollDescription={election.description}
                votes={election.questions[0].votes} numVotes={election.hasVoted.length} />;

    return (
        <PageLayout>
            {pageContent}
        </PageLayout>
    )
}

export default Vote;