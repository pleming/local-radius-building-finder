import Constants from "../common/const.js";

const configureRestApiKey = (restApiKey) => {
    localStorage.setItem(Constants.LOCAL_STORAGE.REST_API_KEY, restApiKey);
};

const loadRestApiKey = () => {
    return localStorage.getItem(Constants.LOCAL_STORAGE.REST_API_KEY);
};

export default {
    configureRestApiKey,
    loadRestApiKey
};
