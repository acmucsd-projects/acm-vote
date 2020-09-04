import React from 'react';
import './AnswerOption.css';

const AnswerOption = (props) => {
    return (
        <div>
            <input placeholder="Option" className="create-poll-field"/>
            <input placeholder="Optional Description" className="create-poll-field-short"/>
        </div>
    )
}

export default AnswerOption;