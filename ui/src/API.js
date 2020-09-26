import axios from "axios";
const serverURL = "https://vote.acmucsd.com";

export default {
  createPoll: function (payload) {
    const options = payload.options.filter((option) => {
      return option.optionName && option.description;
    });

    const config = {
      method: "post",
      url: `${serverURL}/api/election`,
      // Help: How do I figure out the ID?
      id: 10086,
      name: payload.pollTitle,
      description: payload.pollDescription,
      questions: options, // I assume this is options?
      active: true,
      creator: 1234567, // Probably need login to be finished for this?
      deadline: payload.deadline,
      // What about poll type and voters :0
    };

    return axios(config);
  },

  getPoll: function (uuid) {
    return axios.get(`${serverURL}/api/election/${uuid}`);
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
