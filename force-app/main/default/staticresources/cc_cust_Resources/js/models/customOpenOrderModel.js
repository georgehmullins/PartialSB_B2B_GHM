d("customOpenOrderModel", ["ccrz", "log"], function(CCRZ, LOG){
    CCRZ.models.customOpenOrderModel = CCRZ.CloudCrazeModel.extend({
        className : "B2B_customOpenOrderController",
        fetch: function( reqData,callback){ 
            this.invokeCtx('getErpOpenOrders',
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
    return CCRZ.models.customOpenOrderModel;
});