import keywordCategoryMappingService from "../service/keyword-category-mapping-service.js";
import Constants from "../common/const.js";

let originKeywordCategoryMap;
let triggerType;
let triggerKeywordCategoryMapId;

const initialize = () => {
    $("#inputMappingKeyword").val("");
    $("#txtMappingCategoryList").val("");
};

const mappingKeywordCategory = async () => {
    const response = await window.electronDialog.confirm("Mapping Keyword <=> Category");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    const keyword = $("input[name=inputMappingKeyword]").val();
    const categoryList = $("textarea#txtMappingCategoryList").val();

    const newKeywordCategoryMappingData = {
        [Constants.ATTR.KEYWORD]: keyword,
        [Constants.ATTR.CATEGORY_LIST]: categoryList ? categoryList.split("\n") : undefined
    };

    switch (triggerType) {
        case Constants.TRIGGER.NEW_KEYWORD_CATEGORY_MAPPING:
            const keywordCategoryMapId = keywordCategoryMappingService.insertKeywordCategoryMapping(newKeywordCategoryMappingData);
            keywordCategoryMappingService.appendKeywordButton(keywordCategoryMapId);
            break;
        case Constants.TRIGGER.MODIFY_KEYWORD_CATEGORY_MAPPING:
            keywordCategoryMappingService.updateKeywordCategoryMapping(triggerKeywordCategoryMapId, originKeywordCategoryMap, newKeywordCategoryMappingData);
            keywordCategoryMappingService.updateKeywordButton(triggerKeywordCategoryMapId);
            break;
        default:
            const errorMessage = `Unknown trigger type : ${triggerType}`;
            window.electronDialog.error(errorMessage);
            throw new Error(errorMessage);
    }

    hide();
    initialize();
};

const closeKeywordCategoryMappingModal = async () => {
    let confirmNotice;

    switch (triggerType) {
        case Constants.TRIGGER.NEW_KEYWORD_CATEGORY_MAPPING:
            confirmNotice = "new keyword category mapping";
            break;
        case Constants.TRIGGER.MODIFY_KEYWORD_CATEGORY_MAPPING:
            confirmNotice = "keyword category modification";
            break;
        default:
            const errorMessage = `Unknown trigger type : ${triggerType}`;
            window.electronDialog.error(errorMessage);
            throw new Error(errorMessage);
    }

    const response = await window.electronDialog.confirm(`Cancel ${confirmNotice}`);

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    hide();
    initialize();
};

const registerEvent = () => {
    $("#btnConfirmKeywordCategoryMapping").click(async () => {
        await mappingKeywordCategory();
    });

    $("#btnCancelKeywordCategoryMapping").click(async () => {
        await closeKeywordCategoryMappingModal();
    });

    $("#inputMappingKeyword").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            await mappingKeywordCategory();
        }
    });

    $("#keywordCategoryMappingModal").on("shown.bs.modal", () => {
        $("#inputMappingKeyword").focus();
    });
};

const show = (keywordCategoryMapId) => {
    initialize();

    if (keywordCategoryMapId) {
        triggerType = Constants.TRIGGER.MODIFY_KEYWORD_CATEGORY_MAPPING;
        triggerKeywordCategoryMapId = keywordCategoryMapId;
        originKeywordCategoryMap = keywordCategoryMappingService.loadKeywordCategoryMapById(keywordCategoryMapId);

        $("#inputMappingKeyword").val(originKeywordCategoryMap.keyword);
        $("#txtMappingCategoryList").val(originKeywordCategoryMap.categoryList.join("\n"));
    } else {
        triggerType = Constants.TRIGGER.NEW_KEYWORD_CATEGORY_MAPPING;
    }

    $("#keywordCategoryMappingModal").modal("show");
};

const hide = () => {
    $("#keywordCategoryMappingModal").modal("hide");
};

const listenHideModal = (callback) => {
    $("#keywordCategoryMappingModal").on("hide.bs.modal", () => {
        callback();
    });
};

export default {
    initialize,
    show,
    hide,
    registerEvent,
    listenHideModal
};
