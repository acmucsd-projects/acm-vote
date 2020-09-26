import React, { useState } from "react";
import {notification} from "antd";
import HomePageVotePopup from "../components/HomePageVotePopup/HomePageVotePopup";
import graphic from "./acm-vote-graphic.png";

console.log(graphic);

const Home = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  const vote = () => {
    setPopupVisible(!popupVisible);
  }

  const create = () => {
    notification.close("vote-id-empty");
    setPopupVisible(false);
    window.location.href = "/create";
  };

  const myPolls = () => {
    notification.close("vote-id-empty");
    setPopupVisible(false);
    window.location.href = "/my-polls";
  };

  return (
    <div>
      <div id="home-body">
        <img src={graphic} alt="ACM Vote Ballot" />
        <input type="button" className="vote-button" value="Vote" onClick={vote} />
        <HomePageVotePopup popupVisible={popupVisible} />
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
    </div>
  );
}

export default Home;
