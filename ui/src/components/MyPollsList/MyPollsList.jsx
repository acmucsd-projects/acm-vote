import React from "react";
import MyPollsPreview from "../../components/MyPollsPreview/MyPollsPreview";

const MyPollsList = (props) => {
  const {polls} = props;
  return (
    <div className="my-polls-list">
      {polls.length !== 0 ? (
        polls.map((poll) => {
          return (
            <MyPollsPreview key={`${poll.id}`} poll={poll}></MyPollsPreview>
          );
        })
      ) : polls !== null ? (
        <h1>Loading polls...</h1>
      ) : (
        <h1>No active polls!</h1>
      )}
    </div>
  );
};

export default MyPollsList;
