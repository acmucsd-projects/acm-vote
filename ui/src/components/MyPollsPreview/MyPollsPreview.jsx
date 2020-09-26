import React from "react";
import {render} from "react-dom";
import "./MyPollsPreview.css";

const MyPollsPreview = (props) => {
  const {poll} = props;

  // TODO add check for "active" in particular poll's properties

  if (poll.active) {
    return (
      <a
        href={`/election/${poll.id}`}
        id="previewBox"
        className={"background-finished"}
      >
        <div id="pollName">{poll.name}</div>
        <div id="pollId">Poll ID: {poll.id}</div>
      </a>
    );
  } else {
    return (
      <a
        href={`/election/${poll.id}/edit`}
        id="previewBox"
        className={"background-draft"}
      >
        <div id="pollName">{poll.name}</div>
        <div id="pollId">Unfinished draft</div>
      </a>
    );
  }
};

export default MyPollsPreview;
