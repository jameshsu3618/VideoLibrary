import axios from 'axios';
export const KEY = 'AIzaSyA4KnjxRovi7b4vxD4i57XOFOymoj9x5ag';

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet',
        maxResults: 15,
        key: KEY
    }
})