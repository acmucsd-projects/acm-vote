import React from 'react';
import './AnswerOption.css';

const AnswerOption = (props) => {
    let placeholderStr = `Option ${props.id}`;
    return (
        <div>
            <input placeholder={placeholderStr} className="create-poll-field"/>
            <input placeholder="Optional Description" className="create-poll-field-short"/>
        </div>
    )
}

export default AnswerOption;