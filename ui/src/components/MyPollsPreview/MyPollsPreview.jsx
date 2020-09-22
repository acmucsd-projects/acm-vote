import React from 'react';
import { render } from 'react-dom';
import './MyPollsPreview.css';

const MyPollsPreview = (props) => {
    
    // TODO change when middleware is added
    const isFinished = props.pollId != -1;

    if (isFinished) {
        return (
            <a href="#" id="previewBox" className={ 'background-finished' }>
                <div id="pollName">{ props.pollName }</div>
                <div id="pollId">Poll ID: { props.pollId }</div>
            </a>
        )
    }
    else {
        return (
            <a href="#" id="previewBox" className={ 'background-draft' }>
                <div id="pollName">{ props.pollName }</div>
                <div id="pollId">Unfinished draft</div>
            </a>
        )
    }
}

export default MyPollsPreview;