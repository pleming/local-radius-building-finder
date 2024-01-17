import keywordCategoryRuleModal from "./modal/keyword-category-rule-modal.js";

const initialize = () => {
    $("#switchLatitudeLongitude").prop("checked", true);
    $("#switchBaseAddress").prop("checked", false);
    $("#inputSearchBaseAddress").attr("disabled", true);
};

const registerEvent = () => {
    $("#switchLatitudeLongitude").click(() => {
        switchLatitudeLongitude();
    });

    $("#switchBaseAddress").click(() => {
        switchBaseAddress();
    });

    $("#btnKeywordCategoryRule").click(() => {
        keywordCategoryRuleModal.show();
    });

    $("#btnExtractBuildingsData").click(() => {
    });
};

const listenIPCMessage = () => {
    window.electronMenu.listenOpenAbout(async (message) => {
        $("#aboutModal").modal("show");
    });
};

const switchLatitudeLongitude = () => {
    const isChecked = $("#switchLatitudeLongitude").is(":checked");
    $(".input-latitude-longitude").attr("disabled", !isChecked);

    $("#switchBaseAddress").prop("checked", !isChecked);
    $("#inputSearchBaseAddress").attr("disabled", isChecked);
};

const switchBaseAddress = () => {
    const isChecked = $("#switchBaseAddress").is(":checked");
    $("#inputSearchBaseAddress").attr("disabled", !isChecked);

    $("#switchLatitudeLongitude").prop("checked", !isChecked);
    $(".input-latitude-longitude").attr("disabled", isChecked);
};

$(() => {
    initialize();
    keywordCategoryRuleModal.initialize();

    registerEvent();
    keywordCategoryRuleModal.registerEvent();

    listenIPCMessage();
});
