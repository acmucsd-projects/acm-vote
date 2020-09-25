import axios from 'axios';

// I can't seem to find the server URL in the backend just yet:((
const serverURL = "";
const token = ""


export default {
    createPoll: function(payload) {
        const config = {
            method: 'POST',
            url: `${serverURL}/api/election`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ${token}",
            },
            name: payload.pollTitle,
            description: payload.pollDescription,
            questions: payload.questions,
            deadline: payload.deadline,
            users:[0]
        }

        return axios(config);
    },

    getPoll: function(uuid) {
       return axios.get(`${serverURL}/api/election/${uuid}`); 
    }
}