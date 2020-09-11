import React from 'react';
import './AnswerOption.css';

const AnswerOption = (props) => {

    const {id, changeOption, changeDescription} = props;

    let placeholderStr = `Option ${id}`;

    const handleOptionChange = (e) => {
        changeOption(id, e.target.value);
    }

    const handleDescriptionChange = (e) => {
        changeDescription(id, e.target.value);
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