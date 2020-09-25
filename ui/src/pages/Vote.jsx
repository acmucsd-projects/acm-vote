import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import PageLayout from '../components/PageLayout/PageLayout';
import PollVoteHome from '../components/PollVoteHome/PollVoteHome';
import PollVoteMain from '../components/PollVoteMain/PollVoteMain';
import ViewResults from './ViewResults';
import hardCodedPoll from '../data/HardCodedPoll.json';
// import API from '../API';
import './style.css';

const Vote = () => {
    const {uuid} = useParams();
    const [currPage, setCurrPage] = useState(0);
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

    /* Render the corresponding page depending on the current state */
    const pageContent = currPage === 0 ? 
            <PollVoteHome pollTitle={election.name} pollId={election.id} 
            pollDescription={election.description} deadline={election.deadline} 
            setCurrPage={setCurrPage} /> : currPage === 1 ? 
            <PollVoteMain pollTitle={election.name} pollDescription={election.description}
            pollOptions={election.questions} deadline={election.deadline}
            setCurrPage={setCurrPage}/> : 
            <ViewResults />;

    return (
        <PageLayout>
            {pageContent}
        </PageLayout>
    )
}

export default Vote;