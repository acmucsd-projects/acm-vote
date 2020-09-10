import React from 'react';
import '../PollBody/PollBody.css';

const ConfirmDetails = (props) => {
    const {visibility, options, pollTitle, pollDescription, pollType, pollExpiration} = props;
    const listBody = options.map((option) => <li className="options-list-item">{option.optionName}</li>);
    return (
        <div className={visibility}>
            <p><span className="create-poll-bold">Title:{'\u00A0'}</span>{pollTitle}</p>
            <p><span className="create-poll-bold">Description:{'\u00A0'}</span>{pollDescription}</p>
            <p><span className="create-poll-bold">Poll Type:{'\u00A0'}</span>{pollType}</p>
            <p><span className="create-poll-bold">Expiration:{'\u00A0'}</span>{pollExpiration}</p>
            <p><span className="create-poll-bold">Poll Options:{'\u00A0'}</span></p>
            <div className="options-list">
                <ul className="options-list">{listBody}</ul>
            </div>
        </div>
    );
}

export default ConfirmDetails;