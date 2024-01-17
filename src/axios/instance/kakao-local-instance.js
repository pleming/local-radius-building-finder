const axios = require("axios");

const { HTTP_METHOD, AXIOS } = require("../../common/const");

class KakaoLocalInstance {
    instance;

    constructor() {
        this.instance = axios.create({
            "baseURL": AXIOS.BASE_URL.KAKAO_LOCAL,
            "method": HTTP_METHOD.GET,
            "timeout": AXIOS.CONFIG.KAKAO_LOCAL_TIMEOUT,
            "withCredentials": true
        });
    }
}

exports = module.exports = KakaoLocalInstance;
