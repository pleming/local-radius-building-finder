import Constants from "../common/const.js";

const loadConfiguration = (configData) => {
    const { restApiKey, requestDelay, keywordCategoryMap: keywordCategoryData } = configData;

    localStorage.setItem(Constants.LOCAL_STORAGE.REST_API_KEY, restApiKey);
    localStorage.setItem(Constants.LOCAL_STORAGE.REQUEST_DELAY, JSON.stringify(requestDelay));

    const keywordCategoryMap = {};

    for (const keyword in keywordCategoryData) {
        const categoryList = keywordCategoryData[keyword];
        const keywordCategoryMapId = self.crypto.randomUUID();

        keywordCategoryMap[keywordCategoryMapId] = {
            [Constants.ATTR.KEYWORD]: keyword,
            [Constants.ATTR.CATEGORY_LIST]: categoryList
        };
    }

    localStorage.setItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP, JSON.stringify(keywordCategoryMap));
};

const extractConfigurationToSave = () => {
    const configData = {
        [Constants.LOCAL_STORAGE.REST_API_KEY]: localStorage.getItem(Constants.LOCAL_STORAGE.REST_API_KEY) || "",
        [Constants.LOCAL_STORAGE.REQUEST_DELAY]: JSON.parse(localStorage.getItem(Constants.LOCAL_STORAGE.REQUEST_DELAY)) || {},
        [Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP]: {}
    };

    const keywordCategoryMap = JSON.parse(localStorage.getItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP)) || {};

    for (const key in keywordCategoryMap) {
        configData[Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP][keywordCategoryMap[key].keyword] = keywordCategoryMap[key].categoryList;
    }

    return configData;
};

export default {
    loadConfiguration,
    extractConfigurationToSave
};
