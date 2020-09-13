import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import PageLayout from '../components/PageLayout/PageLayout';
import PollVoteHome from '../components/PollVoteHome/PollVoteHome';
import hardCodedPoll from '../data/HardCodedPoll.json';
// import API from '../API';
import './style.css';

const Vote = () => {
    const {uuid} = useParams();
    const [election, setElection] = useState({});
    useEffect(() => {
        /*API.getPoll(uuid)
        .then((response) => {
            setElection(response);
        })*/
        setElection(hardCodedPoll);
    })

    // I probably can't use the const {name, description} = election here
    // Because JavaScript does have restrictions with the use of "name"

    return (
        <PageLayout>
            <PollVoteHome pollTitle={election.name} pollId={election.id} 
            pollDescription={election.description} deadline={election.deadline} />
        </PageLayout>
    )
}

export default Vote;