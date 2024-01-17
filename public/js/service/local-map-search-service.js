import Constants from "../common/const.js";
import StringUtils from "../util/string-utils.js";

const searchBuildings = async () => {
    const response = await window.electronDialog.confirm("Extract building data");

    if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
        return;
    }

    const query = extractSearchQuery();
    verifySearchQuery(query);

    const searchResponse = await window.electronSearch.searchKeyword(query, "restApiKey");

    if(!searchResponse.status) {
        window.electronDialog.error(searchResponse.message);
        return;
    }

    window.electronDialog.info(searchResponse.message);
};

const extractSearchQuery = () => {
    const query = {};

    if ($("#switchLatitudeLongitude").is(":checked")) {
        query.latitude = $("#floatingLatitude").val();
        query.longitude = $("#floatingLongitude").val();
    } else if ($("#switchBaseAddress").is(":checked")) {
        query.baseAddress = $("#inputSearchBaseAddress").val();
    }

    query.radius = $("#inputSearchRadius").val();
    query.keyword = $("#inputSearchKeyword").val();

    return query;
};

const verifySearchQuery = (query) => {
    for (const key in query) {
        if (!StringUtils.hasText(query[key])) {
            const errorMessage = `${key} is empty`;
            window.electronDialog.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
};

export default {
    searchBuildings
};