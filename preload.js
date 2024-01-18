const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronSearch", {
    "searchKeyword": async (query, restApiKey) => {
        return await ipcRenderer.invoke("search:keyword", { query, restApiKey });
    }
});

contextBridge.exposeInMainWorld("electronLoading", {
    "listenStartLoading": async (callback) => {
        ipcRenderer.on("loading:start", (event, message) => {
            callback(message);
        });
    },
    "listenEndLoading": async (callback) => {
        ipcRenderer.on("loading:end", (event, message) => {
            callback(message);
        });
    }
});

contextBridge.exposeInMainWorld("electronMenu", {
    "listenOpenRestApiKey": async (callback) => {
        ipcRenderer.on("menu:restApiKey", (event, message) => {
            callback(message);
        });
    },
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
