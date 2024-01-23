import localMapSearchService from "./service/local-map-search-service.js";
import keywordCategoryMappingService from "./service/keyword-category-mapping-service.js";
import configService from "./service/config-service.js";
import loadingService from "./service/loading-service.js";

import restApiKeyModal from "./modal/rest-api-key-modal.js";
import requestDelayModal from "./modal/request-delay-modal.js";
import keywordCategoryRuleModal from "./modal/keyword-category-rule-modal.js";
import keywordCategoryMappingModal from "./modal/keyword-category-mapping-modal.js";
import keywordCategoryMappingDeleteModal from "./modal/keyword-category-mapping-delete-modal.js";

const initialize = () => {
    $("#switchLatitudeLongitude").prop("checked", true);
    $("#switchBaseAddress").prop("checked", false);
    $("#inputSearchBaseAddress").attr("disabled", true);

    keywordCategoryMappingService.initialize();
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

    window.electronMenu.listenOpenLoad(async (message) => {
        configService.loadConfiguration(message.configData);
        initialize();
    });

    window.electronMenu.listenOpenSaveAs(async (message) => {
        const response = await window.electronMenu.saveAs(message.configFilePath, configService.extractConfigurationToSave());

        if (!response.status) {
            window.electronDialog.error(response.message);
            return;
        }

        window.electronDialog.info(response.message);
    });

    window.electronMenu.listenOpenRestApiKey(async () => {
        restApiKeyModal.show();
    });

    window.electronMenu.listenOpenRequestDelay(async () => {
        requestDelayModal.show();
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
    restApiKeyModal.initialize();
    requestDelayModal.initialize();
    keywordCategoryRuleModal.initialize();
    keywordCategoryMappingModal.initialize();
    keywordCategoryMappingDeleteModal.initialize();

    registerEvent();
    restApiKeyModal.registerEvent();
    requestDelayModal.registerEvent();
    keywordCategoryRuleModal.registerEvent();
    keywordCategoryMappingModal.registerEvent();
    keywordCategoryMappingDeleteModal.registerEvent();

    listenIPCMessage();
});
