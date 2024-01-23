const fs = require("fs");
const { ENCODING } = require("../common/const");

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

    loadFile(filePath) {
        return fs.readFileSync(filePath, ENCODING.UTF_8);
    }
}

exports = module.exports = FileService;
