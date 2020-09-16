import React from 'react';
import './VoteCompletePopup.css';

const VoteCompletePopup = ({ visible }) => {

    const redirectToHome = () => {
        window.location.href="/";
    }

    if (!visible) { return <div></div>; }
    return (
        <div className="vote-complete-popup-container">
            <div className="vote-complete-popup-content">
                <p>Your vote has been submitted!</p>
                <button id="vote-complete-return-home-button" onClick={redirectToHome}>Return home</button>
            </div>
        </div>
    )
}

export default VoteCompletePopup;