d("customCartDetailView",['ccrz','util',], function(CCRZ,UTIL) {

    return {

        extendcustomCartDetailView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

            let isRefreshed = false;
            CCRZ.pubSub.on('view:CartDetailView:refresh', function(cartView){
                console.log(cartView); 
                isExternalPriced();
                CCRZ.remoteActions.cartRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                    className : 'B2B_custom_cart_Controller', 
                    deleteCartValues : function( reqData,callback){ 
                        this.invokeCtx('deleteCartValues', 
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
                $(".clearCartItems").click(function(event){
                    $('#clearAllMod').remove();
                    CCRZ.remoteActions.cartRemoting.deleteCartValues(JSON.stringify({}),function(res,event){
                        console.log('res___'+res);
                        if(res && res.data && res.success ){
                            location.reload();
                        }else{
                            $('.modal-backdrop').hide();
                        }
                    });

                }); 

                $(".deleteItem").click(function(event){
                    isExternalPriced();
                });
            });
            Handlebars.registerHelper('strToJson', function( b2BPLIWrap,options) {
                this.pli = JSON.parse(b2BPLIWrap);
                return options.fn(this);
          });
        }
    }

    function isExternalPriced(){
        let cartItems = CCRZ.cartDetailModel.attributes.ECartItemsS.models;
        let cartOption = CCRZ.cartDetailModel.attributes.b2BPaymentOptions;
        let b2bERPUP = CCRZ.cartDetailModel.attributes.b2bERPUP;
        let isError = false;
        $(cartItems).each(function( index,item) {
            let resp = JSON.parse(JSON.stringify(item.attributes.b2BPLIWrap));
            let parseResp = JSON.parse(resp);
            if(parseResp.isExternalPrice){
                isError = true;
                return false;
            }
        });
        if(isError && !b2bERPUP){
            $('.checkOutBtn').attr("disabled","disabled");
            $(".checkOutBtn").attr("title",CCRZ.pagevars.pageLabels.B2B_checkoutErpDownMsg);
            CCRZ.pubSub.trigger('pageMessage',{messages:[
                {
                    type : 'CUSTOM',
                    labelId : 'B2B_PDP_Price_Not_Available',
                    severity : 'ERROR',
                    classToAppend : 'messagingSection-Error'
                }
            ]});
        } else{
            $('.checkOutBtn').removeAttr("disabled","disabled");
            $(".checkOutBtn").attr("title","");

        }
    }
});