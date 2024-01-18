import Constants from "../common/const.js";

const configureRequestDelay = (avgDelay, upperLimitDelay) => {
    localStorage.setItem(Constants.LOCAL_STORAGE.REQUEST_DELAY, JSON.stringify({ avgDelay, upperLimitDelay }));
};

const loadRequestDelay = () => {
    const requestDelayString = localStorage.getItem(Constants.LOCAL_STORAGE.REQUEST_DELAY);
    const requestDelay = JSON.parse(requestDelayString);

    for (const key in requestDelay) {
        requestDelay[key] = Number(requestDelay[key]);
    }

    return requestDelay;
};

export default {
    configureRequestDelay,
    loadRequestDelay
};
