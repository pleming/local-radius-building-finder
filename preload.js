const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronMenu", {
    "listenOpenAbout": async (callback) => {
        ipcRenderer.on("menu:about", (event, message) => {
            callback(message);
        });
    }
});

contextBridge.exposeInMainWorld("electronDialog", {
    "confirm": async (message) => {
        return await ipcRenderer.invoke("dialog:confirm", message);
    },
    "info": (message) => {
        ipcRenderer.send("dialog:alert:info", message);
    },
    "warning": (message) => {
        ipcRenderer.send("dialog:alert:warning", message);
    },
    "error": (message) => {
        ipcRenderer.send("dialog:alert:error", message);
    }
});
