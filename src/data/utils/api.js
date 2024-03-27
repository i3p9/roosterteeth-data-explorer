import axios from "axios";


export const getSingleEpisodeByUuid = async (uuid) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://roosterteeth.fhm.workers.dev/findEpisode?uuid=${uuid}`,
        headers: {
            'Accept': 'application/json, text/plain, */*'
        }
    };

    try {
        const res = await axios.request(config);
        // const episoddata = JSON.stringify(res.data)
        return res
    } catch (error) {
        return error
    }


    axios.request(config)
        .then((response) => {
            return JSON.stringify(response.data)
        })
        .catch((error) => {
            return error
        });
}


export const getRandomEpisodes = async (channel_id) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://roosterteeth.fhm.workers.dev/random?channel=${channel_id}`,
        headers: {
            'Accept': 'application/json, text/plain, */*'
        }
    };

    try {
        const res = await axios.request(config);
        return res
    } catch (error) {
        return error
    }
}
