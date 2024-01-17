const initialize = () => {
};

const show = (keyword) => {
    $("#deleteKeywordText").text(keyword);
    $("#inputDeleteKeywordConfirmText").attr("placeholder", keyword);
    $("#keywordCategoryMappingDeleteModal").modal("show");
};

const hide = () => {
    $("#keywordCategoryMappingDeleteModal").modal("hide");
};

const registerEvent = () => {
    $("#btnConfirmDeleteKeywordCategoryMapping").click(() => {
    });

    $("#btnCancelDeleteKeywordCategoryMapping").click(() => {
        hide();
    });

    $("#inputDeleteKeywordConfirmText").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            deleteMapping();
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

const deleteMapping = () => {
};

export default {
    initialize,
    show,
    hide,
    registerEvent,
    listenHideModal
};
