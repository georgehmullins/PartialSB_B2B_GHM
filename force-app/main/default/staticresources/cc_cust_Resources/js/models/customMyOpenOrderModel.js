d("customMyOpenOrderModel", ["ccrz", "log"], function(CCRZ, LOG){
    CCRZ.models.customMyOpenOrderModel = CCRZ.CloudCrazeModel.extend({
        className : "B2B_MyAccountController",
        fetch: function( reqData,callback){ 
            this.invokeCtx('getMyOpenOrders',
            reqData, 
                function(resp, evt){ 
                    if(callback){
                        callback(resp,evt);
                    }            
                }, 
                { 
                    buffer:false, 
                    nmsp : false 
                } 
            ); 
        }
    });
    return CCRZ.models.customMyOpenOrderModel;
});