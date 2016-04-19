/**
 * Created by jess on 16/4/19.
 */


'use strict';


class FundApi extends weSDK.ApiBase {


    /**
     * @param code {string} 基金编码
     * @returns {Promise} 获取基金详情
     * @resolve {PromiseResult} promise resolve状态时返回的result对象
     */
    getFundDetail(code, extraOptions){
        let apiName = 'WE_FUND_GET_DEATIL_API';
        let options = {
            data : {
                code:code
            }
        };

        return super.request(apiName,options, extraOptions);
    }

}


//都是暴露单例
module.exports = new FundApi();

