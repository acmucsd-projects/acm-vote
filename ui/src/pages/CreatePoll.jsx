import React from 'react';
import PollBody from '../components/PollBody/PollBody';
import PageLayout from '../components/PageLayout/PageLayout';
import './style.css';

const CreatePoll = ({uuid}) => {
    return (
        <PageLayout>
            <PollBody uuid={uuid}/>
        </PageLayout>
    );
}

export default CreatePoll;