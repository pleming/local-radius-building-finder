const initialize = () => {
};

const registerEvent = () => {
};

const listenIPCMessage = () => {
    window.electronMenu.listenOpenAbout(async (message) => {
        $("#aboutModal").modal("show");
    });
};

$(() => {
    initialize();
    registerEvent();
    listenIPCMessage();
});
