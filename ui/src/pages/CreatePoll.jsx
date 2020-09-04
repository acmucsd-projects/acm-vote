import React, { useState } from 'react';
import PollBody from '../components/PollBody/PollBody';
import PageLayout from '../components/PageLayout/PageLayout';
import './style.css';

const CreatePoll = () => {
    const pollBody = () => {return <PollBody/>;}
    return <PageLayout children={pollBody()} />
}

export default CreatePoll;