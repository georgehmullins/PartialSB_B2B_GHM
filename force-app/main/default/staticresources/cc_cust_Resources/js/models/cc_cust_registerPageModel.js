d("registerPageModel",['ccrz', 'log', 'registerPageModel'], function(CCRZ,log,registerPageModel) {
    CCRZ.models.cc_cust_RegisterPageModel = CCRZ.CloudCrazeModel.extend({
        className : 'B2B_UserRegistrationController',
        
        verifyEmail: function(reqData, callback){
            this.invokePageLoadingCtx(
                "verifyEmail", reqData,
                function(resp, evt){
                    if(callback!=null){
                        callback(resp);
                    }
                },
                {
                    buffer:false,
                    nmsp : false,
                    escape : false
                })
        }

    });
    return CCRZ.models.cc_cust_RegisterPageModel;
});