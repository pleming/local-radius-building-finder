import restApiKeyService from "../service/rest-api-key-service.js";
import Constants from "../common/const.js";

const initialize = () => {
    $("#restApiKeyModal .modal-body input").each((idx, elem) => {
        $(elem).val("");
    });

    $("input[name=inputRestApiKey]").val(restApiKeyService.loadRestApiKey());
};

const confirmRestApiKey = async () => {
    const response = await window.electronDialog.confirm("Confirm REST API Key");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    const restApiKey = $("input[name=inputRestApiKey]").val();

    if (!validateRestApiKey(restApiKey)) {
        return;
    }

    restApiKeyService.configureRestApiKey(restApiKey);

    hide();
    initialize();
};

const validateRestApiKey = (restApiKey) => {
    if (!restApiKey) {
        window.electronDialog.error("REST API Key is empty");
        return false;
    }

    if (restApiKey.length !== Constants.VALIDATION.REST_API_KEY_LENGTH) {
        window.electronDialog.error("REST API Key length is 32 characters");
        return false;
    }

    return true;
};

const closeRestApiKeyModal = async () => {
    const response = await window.electronDialog.confirm("Cancel REST API Key input");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    hide();
    initialize();
};

const registerEvent = () => {
    $("#btnConfirmRestApiKey").click(async () => {
        await confirmRestApiKey();
    });

    $("#btnRestApiKeyModalCancel").click(async () => {
        await closeRestApiKeyModal();
    });

    $("#btnRestApiKeyModalClose").click(async () => {
        await closeRestApiKeyModal();
    });

    $("#inputRestApiKey").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            await confirmRestApiKey();
        }
    });

    $("#restApiKeyModal").on("shown.bs.modal", () => {
        $("#inputRestApiKey").focus();
    });
};

const show = () => {
    initialize();
    $("#restApiKeyModal").modal("show");
};

const hide = () => {
    $("#restApiKeyModal").modal("hide");
};

export default {
    initialize,
    registerEvent,
    show,
    hide
};
