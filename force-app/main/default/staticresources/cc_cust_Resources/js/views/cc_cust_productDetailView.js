d("customPDPView",['ccrz','util',], function(CCRZ,UTIL) {

    return {

        extendcustomPDPView: function() {   

            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{}); 
            let AccountNumber = '';
           // CCRZ.pubSub.on('view:EffAccountSelView:refresh', function(effView){
                let isRefreshed = false, isBackward = false, isRun = false;
                CCRZ.pubSub.on('view:productDetailView:refresh', function(detailView){
                    if(!isRefreshed){
                        CCRZ.remoteActions.pdpRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                            className : 'b2b_customPdpController', 
                            getProdPricing : function( reqData,callback){ 
                                this.invokeCtx('getProdPricing', 
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
                            let _this = this;
                            let ShipToNo = '';
                            let WebUser = '';
                            let B2BID = detailView.model.attributes.product.prodBean.sfid;
                            let PartNo = detailView.model.attributes.product.prodBean.SKU;
                            let Qty = $('#qty').val();

                            CCRZ.remoteActions.pdpRemoting.getProdPricing(JSON.stringify({'ShipToNo': ShipToNo,'WebUser':WebUser,'B2BId':B2BID,'PartNo':PartNo,'Qty':Qty}),function(res,event){
                                console.log('res___'+res);
                                if(res && res.data ){
                                    if(res.data.selectedPLI != ''){
                                        CCRZ.productDetailModel.attributes.product.prodBean.selectedPLI = res.data.selectedPLI;
                                    }
                                    if(res && res.data && res.data.respWrapper && res.data.respWrapper.AvailLinesResult && !isBackward){
                                        CCRZ.productDetailModel.attributes.product.prodBean.AvailLinesResult = res.data.respWrapper.AvailLinesResult;
                                        isBackward = true;
                                        detailView.render();
                                    }else if(CCRZ.productDetailModel.attributes.product.prodBean.EPriceListItemsS[0].b2BExternallyPricedItem){
                                        CCRZ.pubSub.trigger('pageMessage',{messages:[
                                            {
                                                type : 'CUSTOM',
                                                labelId : 'B2B_PDP_Price_Not_Available',
                                                severity : 'ERROR',
                                                classToAppend : 'messagingSection-Error'
                                            }
                                        ]});
                                    }
                                }
                            });
                        }
                    detailView.events["change  #qty"]  = "onProductQuantityChange";
                        detailView.events["keypress  #qty"]  = "onProductQuantityChange";
                        detailView.onProductQuantityChange = function(event){
                            let _this = this;
                            let QtyChanged = $('#qty').val();
                            if(event.keyCode === 13){
                                let ShipToNo = '';
                                let WebUser = '';
                                let B2BID = _this.model.attributes.product.prodBean.sfid;
                                let PartNo = _this.model.attributes.product.prodBean.SKU;
                                let Qty = $('#qty').val();

                                CCRZ.remoteActions.pdpRemoting.getProdPricing(JSON.stringify({'ShipToNo': ShipToNo,'WebUser':WebUser,'B2BId':B2BID,'PartNo':PartNo,'Qty':Qty}),function(res,event){
                            // CCRZ.remoteActions.pdpRemoting.getProdPricing(JSON.stringify({'ShipToNo': ShipToNo,'WebUser':WebUser,'B2BId':B2BID,'PartNo':'11-1419','Qty':Qty}),function(res,event){
                                    console.log('res___'+res)   ;
                                    if(res && res.data && res.data.respWrapper && res.data.respWrapper.AvailLinesResult){
                                        CCRZ.productDetailModel.attributes.product.prodBean.AvailLinesResult = res.data.respWrapper.AvailLinesResult;
                                        isRun = true;
                                    // $('button.addItem').click();
                                        //return false;
                                        _this.render();
                                        setTimeout(() => {
                                            $('#qty').val(QtyChanged);
                                        }, 100);
                                    }else if(CCRZ.productDetailModel.attributes.product.prodBean.EPriceListItemsS[0].b2BExternallyPricedItem){
                                        CCRZ.pubSub.trigger('pageMessage',{messages:[
                                            {
                                                type : 'CUSTOM',
                                                labelId : 'B2B_PDP_Price_Not_Available',
                                                severity : 'ERROR',
                                                classToAppend : 'messagingSection-Error'
                                            }
                                        ]});
                                    }
                                });
                            }
                        }
                    }
                });
           // });                
        }
    }

});