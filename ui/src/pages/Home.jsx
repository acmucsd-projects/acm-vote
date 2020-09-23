import React from 'react';
import graphic from "./acm-vote-graphic.png";

console.log(graphic);

function Home() {
    return (
        <div>
            <img src={graphic} alt="ACM Vote Ballot" />
            <input type="button" class="vote-button" value="Vote"/>
            <input type="button" class="create-button" value="Create Poll"/>
            <input type="button" class="my-button" value="View My Polls"/>
        </div>
    );
}

export default Home
