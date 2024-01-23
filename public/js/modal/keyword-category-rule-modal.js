import keywordCategoryMappingModal from "./keyword-category-mapping-modal.js";
import keywordCategoryMappingDeleteModal from "./keyword-category-mapping-delete-modal.js";

const initialize = () => {
    $(".icon-remove-keyword-category-rule").hide();
};

const registerEvent = () => {
    $("#listGroupKeywordCategoryRule").on("click", ".list-item-keyword-category-rule > .list-group-item", (event) => {
        hide();
        keywordCategoryMappingModal.show($(event.target).attr("data-keyword-category-map-id"));
    });

    $("#btnNewKeywordCategoryRule").click(() => {
        hide();
        keywordCategoryMappingModal.show();
    });

    keywordCategoryMappingModal.listenHideModal(() => {
        show();
    });

    $("#listGroupKeywordCategoryRule").on("click", ".list-item-keyword-category-rule > .icon-remove-keyword-category-rule", (event) => {
        hide();
        keywordCategoryMappingDeleteModal.show($(event.target).prev().attr("data-keyword-category-map-id"));
    });

    keywordCategoryMappingDeleteModal.listenHideModal(() => {
        show();
    });

    $("#listGroupKeywordCategoryRule").on("mouseenter", ".list-item-keyword-category-rule", (event) => {
        $(event.target).closest(".list-item-keyword-category-rule").find(".icon-remove-keyword-category-rule").show();
    });

    $("#listGroupKeywordCategoryRule").on("mouseleave", ".list-item-keyword-category-rule", (event) => {
        $(event.target).closest(".list-item-keyword-category-rule").find(".icon-remove-keyword-category-rule").hide();
    });

    $("#keywordCategoryRuleModalClose").click(()=>{
        hide();
    });
};

const show = () => {
    $("#keywordCategoryRuleModal").modal("show");
};

const hide = () => {
    $("#keywordCategoryRuleModal").modal("hide");
};

export default {
    initialize,
    show,
    hide,
    registerEvent
};
