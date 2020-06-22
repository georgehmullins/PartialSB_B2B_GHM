d("customCheckOutView",['ccrz','util'], function(CCRZ,UTIL) {

    return {

        extendcustomCheckOutView: function() {   

            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{}); 
            
            let isRendered = false, isRun = false, isRefreshed = false, isExecuted = false, isCartUpdated = false; 
            CCRZ.pubSub.on('view:cartCheckoutView:refresh',function(checkoutView){
                console.log('hi________');
                $('#shippingMethod').val(CCRZ.cartCheckoutModel.attributes.shippingMethod);
                    if(!isRefreshed){
                        CCRZ.remoteActions.checkOutRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                            className : 'b2b_checkOut_Controller', 
                            getShippingOptions : function( reqData,callback){ 
                                this.invokeCtx('getShippingOptions', 
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
                            },
                            updateShippingAdrs : function( reqData,callback){ 
                                this.invokeCtx('updateShippingAdrs', 
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
                            },
                            updateCartValues : function( reqData,callback){ 
                                this.invokeCtx('updateCartValues', 
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
                            },
                            updateBuyerInfo : function( reqData,callback){ 
                                this.invokeCtx('updateBuyerInfo', 
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
                            },
                            saveQuote : function( reqData,callback){ 
                                this.invokeCtx('saveQuote', 
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
                            },
                            createPaymentRecord : function( reqData,callback){ 
                                this.invokeCtx('createPaymentRecord', 
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
                    }
                    if (!isRefreshed) {
                        CCRZ.remoteActions.checkOutRemoting.getShippingOptions(JSON.stringify({}),function(res,event){
                            console.log('res___'+res);
                            if(res && res.data  && !isRefreshed){
                                CCRZ.cartCheckoutModel.set('shippingMethods',res.data.shipRateList);
                                CCRZ.cartCheckoutModel.set('defaultShippingRateId',res.data.defaultShippingRateId);
                                CCRZ.cartCheckoutModel.set('shipAddressList',res.data.conAdrsList);
                                CCRZ.cartCheckoutModel.set('termsChk',$('#termsChk').is(":checked"));
                               isRefreshed = true;
                               checkoutView.render();
                            }
                        });
                    }
                    if(CCRZ.cartCheckoutView.subViewArray && CCRZ.cartCheckoutView.subViewArray.length > 0){
                    let isShippingRemoved = false, isUserInfoRemoved = false;
                    let viewLength = CCRZ.cartCheckoutView.subViewArray.length, newSubArray = [];
                    for(let i = 0; i <viewLength; i++) {
                    let currentSubView = CCRZ.cartCheckoutView.subViewArray[i];
                    if (i === 1 && typeof currentSubView == 'undefined') {
                    isShippingRemoved = true;
                    }
                    if (i === 0 && typeof currentSubView == 'undefined') {
                    isUserInfoRemoved = true;
                    }
                    if (typeof currentSubView != 'undefined')
                    {
                    if (typeof currentSubView.title != 'undefined' &&
                    (currentSubView.title === 'Shipping' || currentSubView.title === 'User Information')) {
                    CCRZ.cartCheckoutView.removeView(i);
                    } else if (typeof currentSubView.title != 'undefined' && i === 2) {
                    CCRZ.cartCheckoutView.subView = CCRZ.cartCheckoutView.subViewArray[i].view;
                    newSubArray.push(CCRZ.cartCheckoutView.subViewArray[i]);
                    } else {
                    newSubArray.push(CCRZ.cartCheckoutView.subViewArray[i]);
                    }
                    }
                    }
                    if(!isShippingRemoved && !isUserInfoRemoved && !isRendered)
                    {
                    isRendered = true;
                    CCRZ.cartCheckoutView.subViewArray = newSubArray;
                    CCRZ.cartCheckoutView.navView.model.views = newSubArray;
                    CCRZ.cartCheckoutView.lastIdx = newSubArray.length - 1;
                    CCRZ.cartCheckoutView.render();
                    CCRZ.cartCheckoutView.navView.render();
                    }
                    }
                    checkoutView.events["click .selectShip"]  = "selectShipAdrs";
                    checkoutView.events["click .processReviewCustom"] = "processReviewOrder";
                    checkoutView.events["click .updateBuyerInfo"]  = "updateBuyerInfo";
                    checkoutView.events["click .saveQuote"]  = "saveQuote";
                    checkoutView.events["click #redirectToQuoteDetail"]  = "redirectToQuoteDetail";
                    checkoutView.events["click #redirectToHome"]  = "redirectToHome";
                    checkoutView.events["click #termsChk"]  = "chkProceed";
                    checkoutView.chkProceed = function(event){
                        let termsChk = $('#termsChk').is(":checked");
                        if(termsChk){
                            $('.saveQuote').removeAttr("disabled","disabled");
                            $('.processReviewCustom').removeAttr("disabled","disabled");
                        } else{
                            $('.saveQuote').attr("disabled","disabled");
                            $('.processReviewCustom').attr("disabled","disabled");
                        }
                    
                    };
                    checkoutView.selectShipAdrs = function(event){
                        let id = event.target.id;
                            $( "#shippingAddressModalClose" ).trigger( "click" );
                            CCRZ.remoteActions.checkOutRemoting.updateShippingAdrs(JSON.stringify({'shipToId':id}),function(res,event){
                                console.log('res___2'+res);
                                $('.modal-backdrop ').remove();
                                if(res && res.success){
                                    CCRZ.cartCheckoutModel.set('updatedShipAdrs',res.data.updatedShipAdrs);
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.address1 = res.data.updatedShipAdrs[0].adrsFirstLine;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.address2 = res.data.updatedShipAdrs[0].adrsSecondLine;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.city = res.data.updatedShipAdrs[0].city;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.companyName = res.data.updatedShipAdrs[0].companyName;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.state = res.data.updatedShipAdrs[0].stateIsoCode;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.stateCode = res.data.updatedShipAdrs[0].stateIsoCode;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.postalCode = res.data.updatedShipAdrs[0].postalCode;
                                    CCRZ.cartCheckoutModel.attributes.shippingAddress.partnerId = res.data.updatedShipAdrs[0].partnerId;
                                    $('#addrComp').html(res.data.updatedShipAdrs[0].companyName);
                                    $('#addrFline').html(res.data.updatedShipAdrs[0].adrsFirstLine);
                                    $('#addrLline').html(res.data.updatedShipAdrs[0].adrsSecondLine);
                                    $('#addrCity').html(res.data.updatedShipAdrs[0].city);
                                    $('#addrState').html(res.data.updatedShipAdrs[0].stateIsoCode);
                                    $('#addrPostal').html(res.data.updatedShipAdrs[0].postalCode);
                                    $('#addrPartner').html(res.data.updatedShipAdrs[0].partnerId);
                                    //checkoutView.render();
                                }
                            });
                        //return '';
                    };
                    checkoutView.processReviewOrder = function(event){
                        if(CCRZ.cartCheckoutModel.attributes.shippingAddress.partnerId && 
                            CCRZ.cartCheckoutModel.attributes.billingAddress.partnerId){
                            let shipMethod = $('#shippingMethod').children("option:selected").text().trim();
                            let shipComplete = $('#estShipping').is(":checked");
                            let shippingNotes = $('#shippingNotes').val();
                        // $('#shippingMethod').children("option:selected").attr("selected","selected");
                            CCRZ.remoteActions.checkOutRemoting.updateCartValues(JSON.stringify({'shipMethod':shipMethod,'shipComplete':shipComplete,'shippingNotes':shippingNotes}),function(res,event){
                                console.log('res___2'+res);
                                if(res && res.success){
                                    isExecuted = true;
                                    CCRZ.cartCheckoutModel.set('shippingMethod',shipMethod);
                                    CCRZ.cartCheckoutModel.set('shipComplete',shipComplete);
                                    CCRZ.cartCheckoutModel.set('note',shippingNotes);
                                    //checkoutView.render();
                                    CCRZ.cartCheckoutView.slideRight();
                                }
                            });
                        }else{
                            CCRZ.pubSub.trigger('pageMessage',{messages:[
                                {
                                    type : 'CUSTOM',
                                    labelId : 'B2B_Checkout_Shipping_Error',
                                    severity : 'ERROR',
                                    classToAppend : 'messagingSection-Error'
                                }
                            ]});
                            window.scrollTo($('.messagingSection-Error').offset().top,0);
                        }
                        if(CCRZ.cartCheckoutModel.attributes.b2BPaymentOptions == 'CC' || CCRZ.cartCheckoutModel.attributes.b2BPaymentOptions == 'POCC' ){
                            let cartId = CCRZ.cartCheckoutModel.sfid;
                            CCRZ.remoteActions.checkOutRemoting.createPaymentRecord(JSON.stringify({'cartId':cartId}),function(res,event){
                                console.log('res___2'+res);
                                if(res && res.success){
                                    CCRZ.cartCheckoutModel.set('pymtId',res.data.pymtId);
                                }
                            });
                        }                        
                    };
                    let isError1 = false,isError2 = false,isError3 = false,isError4 = false;
                    checkoutView.updateBuyerInfo = function(event){
                        let fname = $('#fname').val();
                        let lname = $('#lname').val();
                        let phone = $('#phn').val();
                        let emailAdrs = $('#emailAdrs').val();
                        let BuyerContactId = event.target.id;

                        if(fname == "" ){
                            isError1 = true;
                            $('#fname').css('border-color', 'red');
                        } else{
                            isError1 = false;
                            $('#fname').css('border-color', '');
                        }/* if(lname == "" ){
                            isError2 = true;
                            $('#lname').css('border-color', 'red');
                        } else{
                            isError2 = false;
                            $('#lname').css('border-color', '');
                        } if(phone == "" || !UTIL.validatePhone(phone)){
                            isError3 = true;
                            $('#phn').css('border-color', 'red');
                        } else{
                            isError3 = false;
                            $('#phn').css('border-color', '');
                        } if(emailAdrs == "" || !UTIL.validateEmail(emailAdrs)){
                            isError4 = true;
                            $('#emailAdrs').css('border-color', 'red');
                        } else{
                            isError4 = false;
                            $('#emailAdrs').css('border-color', '');
                        }*/
                        
                        if(!isError1){
                            $('#phn').css('border-color', '');
                            $('#emailAdrs').css('border-color', '');
                            
                            $('#lname').css('border-color', '');
                            $( "#buyerInfoModalClose" ).trigger( "click" );
                            CCRZ.remoteActions.checkOutRemoting.updateBuyerInfo(JSON.stringify({'fname':fname,'lname':lname,'phone':phone,'emailAdrs':emailAdrs,'BuyerContactId':BuyerContactId}),function(res,event){
                                console.log('res___2'+res);
                                if(res && res.success){
                                    CCRZ.cartCheckoutModel.set('updatedBuyerInfo',res.data.updatedBuyerInfo);
                                    CCRZ.cartCheckoutModel.set('buyerFirstName',res.data.updatedBuyerInfo.ccrz__BuyerFirstName__c);
                                    CCRZ.cartCheckoutModel.set('buyerLastName',res.data.updatedBuyerInfo.ccrz__BuyerLastName__c);
                                    CCRZ.cartCheckoutModel.set('buyerPhone',res.data.updatedBuyerInfo.ccrz__BuyerPhone__c);
                                    CCRZ.cartCheckoutModel.set('buyerEmail',res.data.updatedBuyerInfo.ccrz__BuyerEmail__c);
                                    $('#bFname').html(res.data.updatedBuyerInfo.ccrz__BuyerFirstName__c +' '+res.data.updatedBuyerInfo.ccrz__BuyerLastName__c);
                                    $('#bPhone').html(res.data.updatedBuyerInfo.ccrz__BuyerPhone__c);
                                    $('#bEmail').html(res.data.updatedBuyerInfo.ccrz__BuyerEmail__c);
                                    setTimeout(function(){
                                        //CCRZ.cartCheckoutView.render();
                                    }, 1000);
                                }
                            });
                        }
                    };
                    checkoutView.saveQuote = function(event){
                        let cartItems = CCRZ.cartCheckoutModel.attributes.cartItems;
                        let b2bERPUP = CCRZ.cartCheckoutModel.attributes.b2bERPUP;
                        let isExternal = false;
                        $(cartItems).each(function( index,item) {
                            let resp = JSON.parse(JSON.stringify(item.b2BPLIWrap));
                            let parseResp = JSON.parse(resp);
                            if(parseResp.isExternalPrice){
                                isExternal = true;
                                return false;
                            }
                        });
                        CCRZ.remoteActions.checkOutRemoting.saveQuote(JSON.stringify({'isExternal':isExternal}),function(res,event) {
                            console.log(res);
                            let sitePrefix = CCRZ.pagevars.sitePrefix; 
                            if ( res.success === true && ( res.data.orderNumber != null && res.data.orderNumber != '' ) ) {
                                CCRZ.cartCheckoutModel.set('orderNumber', res.data.orderNumber);
                                CCRZ.cartCheckoutModel.set('saveQuoteError', false);
                                let myQuoteLink =location.origin+sitePrefix+'/ccrz__MyAccount?'+ CCRZ.buildQueryString('viewState=myQuotes&quote='+CCRZ.cartCheckoutModel.attributes.orderNumber);
                                location.href = myQuoteLink;
                            } else if(res.success === true && !res.data.ERPUP){
                                CCRZ.cartCheckoutModel.set('saveQuoteError', false);
                                let myQuoteLink =location.origin+sitePrefix+'/ccrz__MyAccount?'+ CCRZ.buildQueryString('viewState=myQuotes&quote='+CCRZ.cartCheckoutModel.attributes.sfdcName);
                                location.href = myQuoteLink;
                            } else {
                                CCRZ.cartCheckoutModel.set('orderNumber', false);
                                CCRZ.cartCheckoutModel.set('saveQuoteError', true);
                                setTimeout(() => {
                                    $('#saveAsQuoteStatus').modal('show');
                                }, 2000);
                            }
                            CCRZ.cartCheckoutView.render();
                            
                        })
                    };
                    checkoutView.redirectToQuoteDetail = function(event){
                        console.log('Redirect To Quote Details');
                        let sitePrefix = CCRZ.pagevars.sitePrefix; 
                        event.preventDefault();
                        location.href = location.origin+sitePrefix+'/ccrz__AccountPage'+location.search;
                    };
                    checkoutView.redirectToHome = function(event){
                        console.log('Redirect To Home');
                        let sitePrefix = CCRZ.pagevars.sitePrefix; 
                        let myQuoteLink =location.origin+sitePrefix+'/ccrz__MyAccount?'+ CCRZ.buildQueryString('viewState=myQuotes&quote='+CCRZ.cartCheckoutModel.attributes.orderNumber);
                        location.href = myQuoteLink;
                        
                    };
                if(!isCartUpdated){
                    let reqData ={'fname': CCRZ.cartCheckoutModel.attributes.buyerFirstName,
                        'lname': CCRZ.cartCheckoutModel.attributes.buyerLastName,
                        'phone':CCRZ.cartCheckoutModel.attributes.buyerPhone,
                        'emailAdrs':CCRZ.cartCheckoutModel.attributes.buyerEmail,
                        'BuyerContactId':CCRZ.cartCheckoutModel.attributes.buyerContactId};
                        CCRZ.remoteActions.checkOutRemoting.updateBuyerInfo(JSON.stringify(reqData),function(res,event){
                        console.log('res___2'+res);
                        if(res && res.success){
                            isCartUpdated = true;
                        }
                    });
                }
            });
        }
    }
});