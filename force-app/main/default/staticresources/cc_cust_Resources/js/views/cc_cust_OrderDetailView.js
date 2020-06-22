d("customOrderDetailView",['ccrz','util',], function(CCRZ,UTIL) {
    return {

        extendcustomOrderDetailView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

            let isRefreshed = false, isBackward = false, isRun = false;
            CCRZ.pubSub.on('view:OrderDetailView:refresh', function(detailView){
                if(!isRefreshed){
                    CCRZ.remoteActions.orderConfirmRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                        className : 'B2B_custom_orderConfirmation_Controller', 
                        getERPOrder : function( reqData,callback){ 
                            this.invokeCtx('getERPOrder', 
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
                    if (!isBackward) {
                        if(CCRZ.orderDetailModel.attributes.orderId == undefined){
                            $("#overlay-orderConfirm").removeClass("hide-div");
                            let orderId = CCRZ.orderDetailModel.attributes.sfid;
                            CCRZ.remoteActions.orderConfirmRemoting.getERPOrder(JSON.stringify({'orderId':orderId}),function(res,event){
                                console.log('res___'+res);
                                if(res && res.data && res.data.orderId !=''){
                                    $('#orderConfSuccess').html('Thank you for placing your order! Your order number is '+res.data.orderId+'<br/> Order Date: '+CCRZ.orderDetailModel.attributes.orderDateStr);
                                    CCRZ.orderDetailModel.set('orderId',res.data.orderId);
                                    isBackward = true;
                                } else{
                                    $('#orderConfSuccess').text(CCRZ.pagevars.pageLabels.OrderConfirmation_PlacedOrderMsg);
                                }
                                $("#overlay-orderConfirm").addClass("hide-div");
                            });
                        } else if(CCRZ.orderDetailModel.attributes.orderId != undefined){
                            $('#orderConfSuccess').html('Thank you for placing your order! Your order number is '+CCRZ.orderDetailModel.attributes.orderId+'<br/> Order Date: '+CCRZ.orderDetailModel.attributes.orderDateStr);
                        }
                    }
                }
            });
        }
    }
});