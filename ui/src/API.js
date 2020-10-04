import axios from "axios";
import storage, {tokenGetClaims} from "./storage.js";
const serverURL = "https://vote.acmucsd.com";

export default {
  getAllUsers: function (payload) {
    const token = storage.get("token");

    const conf = {
      method: "GET",
      url: `${serverURL}/api/user`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(conf);
  },
  
  getPoll: function(id) {
    const token = storage.get("token");
    const config = {
      method: 'GET',
      url: `${serverURL}/api/election/${id}`,
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    };

    return axios(config);
  },

  votePoll: function(id, payload, type) {
    const token = storage.get("token");
    const config = {
      method: 'POST',
      url: `${serverURL}/api/election/${id}/vote`,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      data: payload,
    };

    return axios(config);
  },

  getPollResults: function(id) {
    const token = storage.get("token");
    const config = {
      method: 'GET',
      url: `${serverURL}/api/election/${id}/results`,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    return axios(config);
  },

  getPollAudit: function(id) {
    const token = storage.get("token");
    const config = {
      method: 'GET',
      url: `${serverURL}/api/election/${id}/audit`,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    return axios(config);
  },

  getcurrentUser: function(payload) {
    const token = storage.get("token")
    const uuid = tokenGetClaims(token).uuid
    const conf = {
      method: "GET",
      url: `${serverURL}/api/user/${uuid}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(conf);
  },

  createPoll: function (payload) {
    const token = storage.get("token");

    const config = {
      method: "POST",
      url: `${serverURL}/api/election`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: payload.pollTitle,
        description: payload.pollDescription,
        questions: payload.questions,
        deadline: payload.deadline,
        users: payload.users === null ? [0] : payload.users,
      },
    };

    return axios(config);
  },

  activatePoll: function (payload) {
    const token = storage.get("token");
    const config = {
      method: "PUT",
      url: `${serverURL}/api/election/${payload}/activate`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return axios(config);
  },

  getAvailablePolls: function () {
    const config = {
      method: "get",
      url: `${serverURL}/api/election`,
      headers: {
        Authorization: `Bearer ${storage.get("token")}`,
      },
    };

    return axios(config);
  },

  loginUser: (email, password) => {
    const config = {
      method: "post",
      url: `${serverURL}/api/user/login`,

      data: {
        email: email,
        password: password,
      },
    };
    return axios(config);
  },
};
