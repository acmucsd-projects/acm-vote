import React from 'react';
import PageLayout from '../components/PageLayout/PageLayout';
import MyPollsPreview from '../components/MyPollsPreview/MyPollsPreview';
import './style.css';

function MyPolls() {
    return (
        <PageLayout>
            <h1>My Polls</h1>
            <input type="text" placeholder="Search"></input>
            <MyPollsPreview pollName="Another Poll" pollId="-1"></MyPollsPreview>
            <MyPollsPreview pollName="Ice Cream" pollId="1234"></MyPollsPreview>
            <MyPollsPreview pollName="Ranked Ice Cream" pollId="4567"></MyPollsPreview>
        </PageLayout>
    );
}

export default MyPolls