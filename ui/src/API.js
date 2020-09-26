import axios from 'axios';
import storage from './storage.js';

// I can't seem to find the server URL in the backend just yet:((
const serverURL = "https://vote.acmucsd.com";


export default {
  getAllUsers: function(payload) {
    const token = storage.get("token")

    const conf ={
      method: 'GET',
      url: `${serverURL}/api/user`,
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
    }
    return axios(conf)
  },

  createPoll: function(payload) {
    const token = storage.get("token")

    const config = {
        method: 'POST',
        url: `${serverURL}/api/election`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        data:{
          name: payload.pollTitle,
          description: payload.pollDescription,
          questions: payload.questions,
          deadline: payload.deadline,
          users:(payload.users === null ? [0]:payload.users)
        }
    }
    console.log(config)

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
