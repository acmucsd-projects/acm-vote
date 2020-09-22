import React from 'react';
import { render } from 'react-dom';
import './MyPollsPreview.css';

class MyPollsPreview extends React.Component {
    render() {
        // TODO add check for "active" in particular poll's properties
        const isFinished = (this.props.pollId != -1);

        // default unfinished draft
        var backgroundColor = '#62B0FF';
        var pollId = "Unfinished draft" 

        if (isFinished) {
            backgroundColor = '#816DFF';
            pollId = "Poll ID: " + this.props.pollId;
        }
        return(
            <a href="#" id="previewBox" style={{ 'background-color': backgroundColor }} >
                <div id="pollName">{this.props.pollName}</div>
                <div id="pollId">{ pollId }</div>
            </a>
        );
    }
}

export default MyPollsPreview;
