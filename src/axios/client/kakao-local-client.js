const { AXIOS, HEADER } = require("../../common/const");

class KakaoLocalClient {
    #instance;

    constructor(kakaoLocalInstance) {
        this.#instance = kakaoLocalInstance.instance;
    }

    async searchAddress(baseAddress, restApiKey) {
        try {
            const { status, data } = await this.#instance.request({
                "url": AXIOS.URI.KAKAO_LOCAL.SEARCH_ADDRESS,
                "headers": {
                    [HEADER.AUTHORIZATION]: `${HEADER.KAKAO_AUTHORIZATION_VALUE}${restApiKey}`
                },
                "params": {
                    [AXIOS.PARAM.KAKAO_LOCAL.QUERY]: baseAddress,
                    [AXIOS.PARAM.KAKAO_LOCAL.PAGE]: AXIOS.PARAM.KAKAO_LOCAL.PAGE_VALUE
                }
            });

            return {
                status,
                data
            };
        } catch (error) {
            console.error(error.response.data);
            throw new Error(error.response.data.message);
        }
    }
}

exports = module.exports = KakaoLocalClient;
