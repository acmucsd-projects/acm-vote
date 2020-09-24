import React from 'react';
import PageLayout from '../components/PageLayout/PageLayout';
import graphic from "./acm-vote-graphic.png";

console.log(graphic);

function Home() {
    return (
        <PageLayout>
            <div>
                <img src={graphic} class="acm-vote-graphic" alt="ACM Vote Ballot"/>
                <input type="button" class="vote-button" value="Vote"/>
                <input type="button" class="create-button" value="Create Poll"/>
                <input type="button" class="my-button" value="View My Polls"/>
            </div>
        </PageLayout>
    );
}

export default Home
