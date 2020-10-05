import React from 'react';
import '../VoteCompletePopup/VoteCompletePopup.css';

const VoteCompletePopup = (props) => {

    const {auditMessage, popupVisible, setPopupVisible} = props;

    const closePopup = () => {
        document.getElementById('view-results-content').style.filter = '';
        setPopupVisible(false);
    }

    if (!popupVisible) { return <div></div>; }
    return (
        <div className="vote-complete-popup-container">
            <div className="vote-complete-popup-content">
                <div className="audit-results">
                    <p> {auditMessage} </p>
                </div>
                <button id="vote-complete-return-home-button" onClick={closePopup}>Close</button>
            </div>
        </div>
    )
}

export default VoteCompletePopup;