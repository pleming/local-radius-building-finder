import keywordCategoryMappingService from "../service/keyword-category-mapping-service.js";
import Constants from "../common/const.js";

let triggerKeywordCategoryMapId;

const initialize = () => {
    const confirmTextElem = $("#inputDeleteKeywordConfirmText");

    confirmTextElem.val("");
    confirmTextElem.removeAttr("placeholder");

    $("#deleteKeywordText").text("");
};

const deleteMapping = async () => {
    const response = await window.electronDialog.confirm("Delete keyword <=> category mapping");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    const {keyword} = keywordCategoryMappingService.loadKeywordCategoryMapById(triggerKeywordCategoryMapId);

    if (keyword !== $("#inputDeleteKeywordConfirmText").val()) {
        window.electronDialog.error("Keyword is mismatch");
        return;
    }

    keywordCategoryMappingService.deleteKeywordCategoryMapping(triggerKeywordCategoryMapId);
    keywordCategoryMappingService.removeKeywordButtonGroup(triggerKeywordCategoryMapId);

    hide();
    initialize();
};

const closeKeywordCategoryMappingDeleteModal = async () => {
    const response = await window.electronDialog.confirm("Cancel keyword <=> category mapping removal");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    hide();
    initialize();
};

const registerEvent = () => {
    $("#btnConfirmDeleteKeywordCategoryMapping").click(async () => {
        await deleteMapping();
    });

    $("#btnCancelDeleteKeywordCategoryMapping").click(async () => {
        await closeKeywordCategoryMappingDeleteModal();
    });

    $("#inputDeleteKeywordConfirmText").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            await deleteMapping();
        }
    });

    $("#keywordCategoryMappingDeleteModal").on("shown.bs.modal", () => {
        $("#inputDeleteKeywordConfirmText").focus();
    });
};

const listenHideModal = (callback) => {
    $("#keywordCategoryMappingDeleteModal").on("hide.bs.modal", () => {
        callback();
    });
};

const show = (keywordCategoryMapId) => {
    const { keyword } = keywordCategoryMappingService.loadKeywordCategoryMapById(keywordCategoryMapId);

    triggerKeywordCategoryMapId = keywordCategoryMapId;

    $("#deleteKeywordText").text(keyword);
    $("#inputDeleteKeywordConfirmText").attr("placeholder", keyword);

    $("#keywordCategoryMappingDeleteModal").modal("show");
};

const hide = () => {
    $("#keywordCategoryMappingDeleteModal").modal("hide");
};

export default {
    initialize,
    registerEvent,
    listenHideModal,
    show,
    hide
};
