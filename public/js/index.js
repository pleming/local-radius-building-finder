import localMapSearchService from "./service/local-map-search-service.js";
import keywordCategoryRuleModal from "./modal/keyword-category-rule-modal.js";
import loadingService from "./service/loading-service.js";

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

    $("#btnExtractBuildingsData").click(async () => {
        await localMapSearchService.searchBuildings();
    });
};

const listenIPCMessage = () => {
    window.electronLoading.listenStartLoading((message) => {
        loadingService.startLoading(message.title, message.body);
    });

    window.electronLoading.listenEndLoading((message) => {
        loadingService.endLoading();
    });

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
    loadingService.initialize();
    keywordCategoryRuleModal.initialize();

    registerEvent();
    keywordCategoryRuleModal.registerEvent();

    listenIPCMessage();
});
