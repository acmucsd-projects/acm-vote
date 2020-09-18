import React, { useState } from 'react';
import VoteCompletePopup from '../VoteCompletePopup/VoteCompletePopup';
import '../PollVoteHome/PollVoteHome.css';
import './PollVoteMain.css';

const PollVoteMain = (props) => {
    const [selection, setSelection] = useState(-1);
    const [popupVisible, setPopupVisible] = useState(false);
    const { pollTitle, pollDescription, pollOptions, deadline, setCurrPage } = props;

    /* Check the deadline again, and check whether the user selected an option */
    const submitVote = () => {
        const currDate = new Date();
        const deadlineDate = new Date(deadline);
        if (currDate > deadlineDate) {
            alert("The deadline to vote has passed. Click ok to be redirected to the vote page.");
            setCurrPage(0);
        }
        else if (selection == -1) { alert("Please select an option"); }
        else {
            document.getElementById('vote-main-body').style.filter = 'blur(10px)';
            setPopupVisible(true);
        }
    }

    const optionsSection = pollOptions ? pollOptions.map((option, optionInd) => {
        const optionId = "option" + optionInd;
        return (
            <div className="vote-option-box">
                <label for={optionId}>{option.optionName}</label>
                <input type="radio" name="pollOption" id={optionId} onClick={() => setSelection(optionInd)} />
            </div>
        );
    }) : <div></div>

    return (
        <div className="page-body vote-page-body">
            <div id="vote-main-body">
                <h1>{pollTitle}</h1>
                <p id="poll-vote-main-description">{pollDescription}</p>
                {optionsSection}
                <p id="poll-vote-main-footer">Please check your vote carefully before submitting</p>
                <div className="vote-buttons-container">
                    <button className="vote-buttons" id="vote-submit-button" onClick={submitVote}>Vote</button>
                </div>
            </div>
            <VoteCompletePopup visible={popupVisible}/>
        </div>
    )
}

export default PollVoteMain;
