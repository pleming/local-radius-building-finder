import requestDelayService from "../service/request-delay-service.js";
import Constants from "../common/const.js";

const initialize = () => {
    $("#requestDelayModal .modal-body input").each((idx, elem) => {
        $(elem).val("");
    });

    const requestDelay = requestDelayService.loadRequestDelay();

    if (requestDelay) {
        $("input[name=inputAvgDelay]").val(requestDelay.avgDelay);
        $("input[name=inputUpperLimitDelay]").val(requestDelay.upperLimitDelay);
    }
};

const confirmRequestDelay = async () => {
    const response = await window.electronDialog.confirm("Confirm request delay");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    const avgDelay = $("input[name=inputAvgDelay]").val();
    const upperLimitDelay = $("input[name=inputUpperLimitDelay]").val();

    if (!validateRequestDelay(avgDelay, upperLimitDelay)) {
        return;
    }

    requestDelayService.configureRequestDelay(avgDelay, upperLimitDelay);

    hide();
    initialize();
};

const validateRequestDelay = (avgDelay, upperLimitDelay) => {
    if (!avgDelay) {
        window.electronDialog.error("Average delay is empty");
        return false;
    }

    if (!upperLimitDelay) {
        window.electronDialog.error("Upper limit delay is empty");
        return false;
    }

    if (avgDelay < Constants.VALIDATION.LOWER_REQUEST_DELAY || upperLimitDelay < Constants.VALIDATION.LOWER_REQUEST_DELAY) {
        window.electronDialog.error(`Request delay must be at least ${Constants.VALIDATION.LOWER_REQUEST_DELAY}ms`);
        return false;
    }

    if (avgDelay > upperLimitDelay) {
        window.electronDialog.error("Average delay must be lower than upper limit delay");
        return false;
    }

    return true;
};

const closeRequestDelayModal = async () => {
    const response = await window.electronDialog.confirm("Cancel request delay input");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    hide();
    initialize();
};

const registerEvent = () => {
    $("#btnConfirmRequestDelay").click(async () => {
        await confirmRequestDelay();
    });

    $("#btnRequestDelayModalCancel").click(async () => {
        await closeRequestDelayModal();
    });

    $("#btnRequestDelayModalClose").click(async () => {
        await closeRequestDelayModal();
    });

    $("#inputUpperLimitDelay").on("keyup", async (event) => {
        if (event.keyCode === 13) {
            await confirmRequestDelay();
        }
    });

    $("#requestDelayModal").on("shown.bs.modal", () => {
        $("#inputAvgDelay").focus();
    });
};

const show = () => {
    initialize();
    $("#requestDelayModal").modal("show");
};

const hide = () => {
    $("#requestDelayModal").modal("hide");
};

export default {
    initialize,
    registerEvent,
    show,
    hide
};
