const fs = require("fs");

class FileService {
    #dialog;

    constructor(dialog) {
        this.#dialog = dialog;
    }

    saveAs() {
        return this.#dialog.showSaveDialogSync({
            "filters": [
                {
                    "name": "Extracted building data file (*.csv)",
                    "extensions": ["csv"]
                }
            ]
        });
    }

    saveFile(filePath, data) {
        fs.writeFileSync(filePath, data);
    }
}

exports = module.exports = FileService;
