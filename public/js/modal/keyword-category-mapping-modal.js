import Constants from "../common/const.js";

let triggerType;
let triggerKeyword;

const initialize = () => {
    $("#inputMappingKeyword").val("");
    $("#txtMappingCategoryList").val("");
};

const show = (keyword) => {
    initialize();

    if (keyword) {
        triggerType = Constants.TRIGGER.MODIFY_KEYWORD_CATEGORY_MAPPING;
        triggerKeyword = keyword;

        $("#inputMappingKeyword").val(keyword);
        $("#txtMappingCategoryList").val(["Category_01", "Category_02"].join("\n"));
    } else {
        triggerType = Constants.TRIGGER.NEW_KEYWORD_CATEGORY_MAPPING;
    }

    $("#keywordCategoryMappingModal").modal("show");
};

const hide = () => {
    $("#keywordCategoryMappingModal").modal("hide");
};

const registerEvent = () => {
    $("#btnConfirmKeywordCategoryMapping").click(() => {
    });

    $("#btnCancelKeywordCategoryMapping").click(() => {
        hide();
    });

    $("#inputMappingKeyword").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            mappingKeywordCategory();
        }
    });

    $("#keywordCategoryMappingModal").on("shown.bs.modal", () => {
        $("#inputMappingKeyword").focus();
    });
};

const listenHideModal = (callback) => {
    $("#keywordCategoryMappingModal").on("hide.bs.modal", () => {
        callback();
    });
};

const mappingKeywordCategory = () => {
};

export default {
    initialize,
    show,
    hide,
    registerEvent,
    listenHideModal
};
