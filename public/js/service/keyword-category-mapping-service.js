import Constants from "../common/const.js";

const global = {
    "keywordCategoryMap": {}
};

const keywordButtonHTML =
    `<div class="list-item-keyword-category-rule">
        <button type="button" class="list-group-item list-group-item-action btn-keyword"></button>
        <button type="button" class="btn-close icon-remove-keyword-category-rule" aria-label="close"></button>
    </div>`;

const initialize = () => {
    global.keywordCategoryMap = JSON.parse(localStorage.getItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP)) || {};

    $("#listGroupKeywordCategoryRule").html("");

    for (const keywordCategoryMapId in global.keywordCategoryMap) {
        appendKeywordButton(keywordCategoryMapId);
    }
};

const appendKeywordButton = (keywordCategoryMapId) => {
    const keywordButtonGroup = $($.parseHTML(keywordButtonHTML));
    const keywordButton = keywordButtonGroup.find(".btn-keyword");

    keywordButton.text(global.keywordCategoryMap[keywordCategoryMapId].keyword);
    keywordButton.attr("data-keyword-category-map-id", keywordCategoryMapId);

    $("#listGroupKeywordCategoryRule").append(keywordButtonGroup);
};

const updateKeywordButton = (keywordCategoryMapId) => {
    const keywordCategoryMap = global.keywordCategoryMap[keywordCategoryMapId];
    const keywordButton = $(`.btn-keyword[data-keyword-category-map-id=${keywordCategoryMapId}]`);

    keywordButton.text(keywordCategoryMap.keyword);
};

const removeKeywordButtonGroup = (keywordCategoryMapId) => {
    $(`.btn-keyword[data-keyword-category-map-id=${keywordCategoryMapId}]`).parent(".list-group-keyword-category-rule").remove();
};

const insertKeywordCategoryMapping = (keywordCategoryMappingData) => {
    verifyKeywordCategoryMappingData(keywordCategoryMappingData);
    verifyDuplicatedKeyword(keywordCategoryMappingData.keyword);

    const newKeywordCategoryMapId = self.crypto.randomUUID();
    global.keywordCategoryMap[newKeywordCategoryMapId] = keywordCategoryMappingData;

    localStorage.setItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP, JSON.stringify(global.keywordCategoryMap));
    return newKeywordCategoryMapId;
};

const loadKeywordCategoryMapById = (keywordCategoryMapId) => {
    return global.keywordCategoryMap[keywordCategoryMapId];
};

const loadKeywordCategoryMapByKeyword = (keyword) => {
    for (const keywordCategoryMapId in global.keywordCategoryMap) {
        if (global.keywordCategoryMap[keywordCategoryMapId].keyword === keyword) {
            return global.keywordCategoryMap[keywordCategoryMapId];
        }
    }

    return {
        [Constants.ATTR.KEYWORD]: "",
        [Constants.ATTR.CATEGORY_LIST]: []
    };
};

const updateKeywordCategoryMapping = (keywordCategoryMapId, originKeywordCategoryMap, newKeywordCategoryMappingData) => {
    verifyKeywordCategoryMappingData(newKeywordCategoryMappingData);

    if (originKeywordCategoryMap.keyword !== newKeywordCategoryMappingData.keyword) {
        verifyDuplicatedKeyword(newKeywordCategoryMappingData.keyword);
    }

    global.keywordCategoryMap[keywordCategoryMapId] = newKeywordCategoryMappingData;
    localStorage.setItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP, JSON.stringify(global.keywordCategoryMap));
};

const deleteKeywordCategoryMapping = (keywordCategoryMapId) => {
    delete global.keywordCategoryMap[keywordCategoryMapId];
    localStorage.setItem(Constants.LOCAL_STORAGE.KEYWORD_CATEGORY_MAP, JSON.stringify(global.keywordCategoryMap));
};

const verifyKeywordCategoryMappingData = (keywordCategoryMappingData) => {
    for (const key in keywordCategoryMappingData) {
        if (!keywordCategoryMappingData[key]) {
            const errorMessage = `${key} is empty`;
            window.electronDialog.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
};

const verifyDuplicatedKeyword = (keyword) => {
    for (const keywordCategoryMapId in global.keywordCategoryMap) {
        if (global.keywordCategoryMap[keywordCategoryMapId].keyword === keyword) {
            const errorMessage = `Duplicated keyword : ${keyword}`;
            window.electronDialog.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
};

export default {
    initialize,
    appendKeywordButton,
    updateKeywordButton,
    removeKeywordButtonGroup,
    insertKeywordCategoryMapping,
    loadKeywordCategoryMapById,
    loadKeywordCategoryMapByKeyword,
    updateKeywordCategoryMapping,
    deleteKeywordCategoryMapping
};
