import React from 'react';
import '../VoteCompletePopup/VoteCompletePopup.css';

const VoteCompletePopup = (props) => {

    const {popupVisible, setPopupVisible} = props;

    const closePopup = () => {
        document.getElementById('view-results-content').style.filter = '';
        setPopupVisible(false);
    }

    if (!popupVisible) { return <div></div>; }
    return (
        <div className="vote-complete-popup-container">
            <div className="vote-complete-popup-content">
                <p>
                    We're no strangers to love, You know the rules and so do I.
                    A full commitment's what I'm thinking of, You wouldn't get this from any other guy.
                    I just wanna tell you how I'm feeling, Gotta make you understand -
                </p>
                <p><strong>
                    Never gonna give you up, Never gonna let you down, Never gonna run around and desert you.
                </strong></p>
                <p><strong>
                    Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you.
                </strong></p>
                <button id="vote-complete-return-home-button" onClick={closePopup}>Close</button>
            </div>
        </div>
    )
}

export default VoteCompletePopup;