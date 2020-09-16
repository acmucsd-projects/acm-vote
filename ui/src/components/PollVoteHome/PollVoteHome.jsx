import React, {useState, useEffect} from 'react';
import './PollVoteHome.css';

const PollVoteHome = (props) => {
    const {pollTitle, pollId, pollDescription, deadline, setCurrPage} = props;
    const [deadlineDate, setDeadlineDate] = useState();

    useEffect(() => {
        setDeadlineDate(new Date(deadline));
    })

    /* The vote button and its functionalities depending on whether the current poll has expired */
    const startVote = () => {
        setCurrPage(1);
    }

    const voteButtonActivated = (
        <button className="vote-buttons" id="vote-button-activated" onClick={startVote} >Vote</button>
    );

    const notifyPollExpired = () => {
        alert("The deadline to vote has passed. Click the View Results button to view results!");
    }

    const voteButtonDisabled = (
        <button className="vote-buttons" id="vote-button-disabled" onClick={notifyPollExpired}>Vote</button>
    );
    
    // Renders a certain state of the vote button depending on whether the current poll has expired
    const voteButton = () => {
        const currDate = new Date();
        if(!deadlineDate){return;}
        return currDate.getTime() <= deadlineDate.getTime() ? voteButtonActivated : voteButtonDisabled;
    }

    /* The view results button and its functionalities depending on whether the current poll has expired */
    const viewResultsActivated = (
        <button className="vote-buttons" id="view-results-button-activated" >View Results</button>
    )

    const notifyResultsUnavailable = () => {
        alert("Results for this poll are not yet available. Click the vote button to vote!");
    }

    const viewResultsDisabled = (
        <button className="vote-buttons" id="view-results-button-disabled" 
        onClick={notifyResultsUnavailable}>View Results</button>
    )

    // Renders a certain state of the view results button depending on whether the current poll has expired
    const viewResultsButton = () => {
        const currDate = new Date();
        if(!deadlineDate){return;}
        return currDate.getTime() <= deadlineDate.getTime() ? viewResultsDisabled : viewResultsActivated;
    }

    return (
        <div className="page-body vote-page-body">
            <h1>{pollTitle}</h1>
            <p id="poll-id-vote">Poll ID: {pollId}</p>
            <p>Vote by: {deadline}</p>
            <p>{pollDescription}</p>
            <div className="vote-buttons-container">
                {voteButton()}
                {viewResultsButton()}
            </div>
        </div>
    )
}

export default PollVoteHome;