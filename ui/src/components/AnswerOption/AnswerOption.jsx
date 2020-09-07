import React from 'react';
import './AnswerOption.css';

const AnswerOption = (props) => {
    let placeholderStr = `Option ${props.id}`;

    const handleOptionChange = (e) => {
        props.changeOption(props.id, e.target.value);
    }

    const handleDescriptionChange = (e) => {
        props.changeDescription(props.id, e.target.value);
    }

    return (
        <div>
            <input placeholder={placeholderStr} onBlur={handleOptionChange} className="create-poll-field"/>
            <input placeholder="Optional Description" 
                onBlur={handleDescriptionChange} className="create-poll-field-short"/>
        </div>
    )
}

export default AnswerOption;