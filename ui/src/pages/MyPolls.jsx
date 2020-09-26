import React, {useState, useEffect} from "react";
import API from "../API";
import PageLayout from "../components/PageLayout/PageLayout";
import MyPollsList from "../components/MyPollsList/MyPollsList";
import "./style.css";

function MyPolls() {
  const [polls, setPolls] = useState([]);
  useEffect(() => {
    API.getAvailablePolls().then((response) => {
      if (response.data.length === 0) {
        setPolls(null);
      }
      setPolls(response.data);
    });
  }, []);
  return (
    <PageLayout>
      <h1>My Polls</h1>
      <input type="text" placeholder="Search"></input>
      <MyPollsList polls={polls} />
    </PageLayout>
  );
}

export default MyPolls;
