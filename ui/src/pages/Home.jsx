import React from "react";
import graphic from "./acm-vote-graphic.png";

console.log(graphic);

function Home() {
  const create = () => {
    window.location.href = "/create";
  };

  const myPolls = () => {
    window.location.href = "/my-polls";
  };

  return (
    <div>
      <img src={graphic} alt="ACM Vote Ballot" />
      <input type="button" className="vote-button" value="Vote" />
      <input
        type="button"
        className="create-button"
        value="Create Poll"
        onClick={create}
      />
      <input
        type="button"
        className="my-button"
        value="View My Polls"
        onClick={myPolls}
      />
    </div>
  );
}

export default Home;
