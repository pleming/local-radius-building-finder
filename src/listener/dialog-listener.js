class DialogListener {
    #ipcMain;
    #dialog;

    constructor(ipcMain, dialog) {
        this.#ipcMain = ipcMain;
        this.#dialog = dialog;
    }

    registerListener() {
        this.#listenConfirmDialog();
        this.#listenAlertDialog("info");
        this.#listenAlertDialog("warning");
        this.#listenAlertDialog("error");
    }

    #listenConfirmDialog() {
        this.#ipcMain.handle("dialog:confirm", (event, message) => {
            return this.#dialog.showMessageBoxSync({
                "type": "question",
                "buttons": ["Yes", "No"],
                message
            });
        });
    }

    #listenAlertDialog(type) {
        this.#ipcMain.on(`dialog:alert:${type}`, (event, message) => {
            return this.#dialog.showMessageBoxSync({
                type,
                message
            });
        });
    }
}

exports = module.exports = DialogListener;
