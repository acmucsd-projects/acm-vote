import React from 'react';
import './Voter.css';

const Voter = (props) => {
    const { ind, id, name, removeVoter } = props;
    return (
        <tr className="poll-voter-row">
            <td className="poll-voter-id">{ind}.</td>
            <td className="poll-voter-name">{name}</td>
            <td className="poll-voter-button">
                <span className="poll-voter-remove" onClick ={() => removeVoter(props.id)}>remove</span>
            </td>
        </tr>
    );
}

export default Voter;