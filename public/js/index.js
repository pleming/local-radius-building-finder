import localMapSearchService from "./service/local-map-search-service.js";
import loadingService from "./service/loading-service.js";

import keywordCategoryRuleModal from "./modal/keyword-category-rule-modal.js";
import restApiKeyModal from "./modal/rest-api-key-modal.js";

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

    window.electronLoading.listenEndLoading(() => {
        loadingService.endLoading();
    });

    window.electronMenu.listenOpenRestApiKey(async () => {
        restApiKeyModal.show();
    });

    window.electronMenu.listenOpenAbout(async () => {
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
    restApiKeyModal.initialize();

    registerEvent();
    keywordCategoryRuleModal.registerEvent();
    restApiKeyModal.registerEvent();

    listenIPCMessage();
});
