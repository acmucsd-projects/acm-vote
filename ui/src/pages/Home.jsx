import React from 'react';

function Home() {

    const create = () => {
        window.location.href='/create';
    }

    const myPolls = () => {
        window.location.href='/my-polls';
    }

    return (
        <div>
            <h1>Home</h1>
            <input type="button" value="Create New Poll" onClick={create} />
            <input type="button" value="View My Polls" onClick={myPolls} />
            <input type="button" value="View All Polls"/>
        </div>
    );
}

export default Home