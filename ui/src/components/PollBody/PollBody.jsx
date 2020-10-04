import React, {useState, useEffect} from "react";

import BasicInformation from "../BasicInformation/BasicInformation";
import SelectVoters from "../SelectVoters/SelectVoters";
import SetAnswerOptions from "../SetAnswerOptions/SetAnswerOptions";
import ConfirmDetails from "../ConfirmDetails/ConfirmDetails";
import {notification} from "antd";
import API from "../../API";
import "./PollBody.css";

const PollBody = ({uuid}) => {
  const [currPage, setCurrPage] = useState(0);
  const [privacy, setPrivacy] = useState("private");

  const [pollTitle, setPollTitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [pollType, setPollType] = useState("");
  const [pollExpiration, setPollExpiration] = useState();
  const [voters, setVoters] = useState([]);
  const [options, setOptions] = useState([
    {optionName: "", description: "", votes: 0},
    {optionName: "", description: "", votes: 0},
  ]);

  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    API.getAllUsers()
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        notification.open({
          message: "Cannot get list of potential voters",
          description: error,
        });
      });

    API.getcurrentUser()
      .then((response) => {
        setCurrentUser(response.data.user);
      })
      .catch((error) => {
        notification.open({
          message: "Cannot get current user's information",
          description: error,
        });
      });
  }, []);

  /* Use an array to store page names to make the code more concise :0 */
  const pageNames = [
    "Create Poll",
    "Select Voters",
    "Set Answer Options",
    "Confirm Details",
    "Expiration",
  ];

  /* Returns whether a section is currently visible */
  const getVisibility = (pageNumber) => {
    return pageNumber === currPage ? "visible" : "hidden";
  };

  /* Returns the title of the current page */
  const getTitle = () => {
    if (currPage <= 4) {
      return pageNames[currPage];
    }
    return "Invalid Page";
  };

  /* Top Button: Title */
  const getTopButtonText = () => {
    if (currPage === 3) {
      return "Finish";
    }
    return "Continue";
  };

  /* Top button function: Continuing to next page */
  const continueToNextPage = () => {
    // This is a special case because we will proceed to different pages depending on privacy settings
    if (currPage === 0) {
      if (privacy === "private") {
        setCurrPage(1);
      } else {
        setCurrPage(2);
      }
    } else {
      setCurrPage(currPage + 1);
    }
    window.scrollTo(0, 0);
  };

  /* Top button function: Creating the Poll */
  const createPoll = async () => {
    let votes = {};
    let type = "";
    if (pollType === "Multiple Choice") {
      type = "FPTP";
      options.forEach((option) => {
        // votes meaning the option array
        votes[option.optionName] = {
          description: option.description,
        };
      });
    } else {
      type = "STV";
      votes = [];
      options.forEach((option) => {
        // votes meaning the option array
        votes.push({
          name: option.optionName,
          description: option.description,
        });
      });
    }

    // Will probably support multiple questions in the future!
    const questions = {
      [pollTitle]: {
        answers: votes,
        type: type,
      },
    };
    const users =
      privacy === "private"
        ? voters.map((voter) => {
            return voter.id;
          })
        : null;

    const payload = {
      pollTitle: pollTitle,
      pollDescription: pollDescription,
      questions: questions,
      deadline: pollExpiration,
      users: users,
    };

    const newPoll = await API.createPoll(payload);
    await API.activatePoll(newPoll.data.id);
    notification.open({
      message: "Poll created!",
      description: "Click this notification to go vote on this election!",
      onClick: () => {
        window.location.href = `/election/${newPoll.data.id}`;
      },
    });
  };

  /* Top button: Determines which function to execute depending on the current page */
  const topButtonFunction = () => {
    if (currPage === 3) {
      createPoll();
    } else {
      continueToNextPage();
    }
  };

  /* Bottom button: title */
  const getBottomButtonText = () => {
    if (currPage === 0) {
      return "Cancel";
    }
    return "Back";
  };

  /* Bottom button function: Cancels form creation */
  const cancelCreation = () => {
    console.log("Cancelled :((");
  };

  /* Bottom button function: Goes back */
  const goBacktoLastPage = () => {
    // Special handling of Page 'Set Answer Options'
    if (currPage === 2) {
      if (privacy === "private") {
        setCurrPage(1);
      } else {
        setCurrPage(0);
      }
    } else {
      setCurrPage(currPage - 1);
    }
    window.scrollTo(0, 0);
  };

  /* Bottom button: Determines which function to execute depending on the current page */
  const bottomButtonFunction = () => {
    if (currPage === 0) {
      cancelCreation();
    } else {
      goBacktoLastPage();
    }
  };

  /* ------------------------------------ The actual body of the poll ----------------------------------- */
  return (
    <div className="poll-body">
      <h1>{getTitle(currPage)}</h1>
      <form>
        <BasicInformation
          visibility={getVisibility(0)}
          setPollTitle={setPollTitle}
          setPollDescription={setPollDescription}
          setPollType={setPollType}
          setPollExpiration={setPollExpiration}
          privacy={privacy}
          setPrivacy={setPrivacy}
        />

        <SelectVoters
          visibility={getVisibility(1)}
          voters={voters}
          setVoters={setVoters}
          members={members.filter((mem) => {
            const uName = currentUser.firstName + " " + currentUser.lastName;
            return uName !== mem.name;
          })}
        />

        <SetAnswerOptions
          visibility={getVisibility(2)}
          options={options}
          setOptions={setOptions}
          pollTitle={pollTitle}
          pollDescription={pollDescription}
        />

        <ConfirmDetails
          visibility={getVisibility(3)}
          options={options}
          pollTitle={pollTitle}
          pollDescription={pollDescription}
          pollType={pollType}
          pollExpiration={pollExpiration}
          privacy={privacy}
        />
      </form>
      <div className="nav-buttons">
        <button
          className="create-poll-field nav-button"
          id="top-button"
          onClick={topButtonFunction}
        >
          {getTopButtonText()}
        </button>
        <button
          className="create-poll-field nav-button"
          id="bottom-button"
          onClick={bottomButtonFunction}
        >
          {getBottomButtonText()}
        </button>
      </div>
    </div>
  );
};

export default PollBody;
