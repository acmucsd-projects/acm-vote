import React from 'react';
import {notification} from 'antd';
import './ConfirmRankedChoicePopup.css';

const ConfirmRankedChoicePopup = (props) => {

    const {confirmationVisible, setConfirmationVisible, 
        setPopupVisible, choices, pollOptions, deadline, setCurrPage} = props;

    const choiceField = choices ? choices.map((choice, ind) => {
        return ( 
            choice != -1 &&
            <div className="ranked-choice-option">
                <span>{ind + 1}.</span>
                {pollOptions[choice].optionName}
            </div>
        )
    }) : <div></div> 

    const submitVote = () => {
        const currDate = new Date();
        const deadlineDate = new Date(deadline);
        if (currDate > deadlineDate) {
            notification.open({
                key: "poll-expired-on-submit-ranked-choice",
                message: "Unable to Vote",
                description: "The deadline to vote has passed. Click this notification to go back to home page!",
                onClick: () => {
                    notification.close("poll-expired-on-submit-ranked-choice");
                    setCurrPage(0);
                }
            });
        }
        else {
            setConfirmationVisible(false);
            setPopupVisible(true);
        }
    }

    const goBackToVote = () => {
        document.getElementById('vote-main-body').style.filter = '';
        setConfirmationVisible(false);
    }

    return (
        confirmationVisible ?
        <div className="ranked-choice-confirm-container">
            <div className="ranked-choice-confirm-content">
                <p>Is this order correct?</p>
                {choiceField}
                <button id="ranked-choice-confirm-button" onClick={submitVote}>Yes, Confirm</button>
                <button id="ranked-choice-go-back-button" onClick={goBackToVote}>Cancel</button>
            </div>
        </div> : <div></div>
    )
}

export default ConfirmRankedChoicePopup;