d("customQuickOrderView",['ccrz', 'util', 'customQuickOrderModel'], function(CCRZ, UTIL, customQuickOrderModel) {
    return{
        extendcustomQuickOrderView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

            CCRZ.remoteActions.QuickOrderRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                className : 'B2B_quickOrder_controller', 
                getProductDetail : function( reqData,callback){ 
                    this.invokeCtx('getProductDetail', 
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
                updateCart : function( reqData,callback){ 
                    this.invokeCtx('updateCart', 
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

            let sumOfArray ,removedSize ;
            CCRZ.views.customQuickOrderView = CCRZ.CloudCrazeView.extend({
                el: CCRZ.uiProperties.customQuickOrderView.desktop.selector,
                viewName: "customQuickOrderView",
                quickOrderTemplate: CCRZ.util.template(CCRZ.uiProperties.customQuickOrderView.desktop.tmpl),
                
                init: function(){   
                    this.model = CCRZ.models.customQuickOrderModel;
                    let rowsArray = ['1','2','3','4','5','6','7','8','9','10'];
                    //slet rowsArray = new Array();
                    sumOfArray = rowsArray.length;
                    CCRZ.models.customQuickOrderModel.set('rows',rowsArray);
                    CCRZ.models.customQuickOrderModel.set('sumOfArray',sumOfArray);
                    this.render();
                },
                render: function(){
                    this.$el.html(this.quickOrderTemplate(this.model.toJSON()));
                    this.skuFocusOut();
                    this.qtyFocusOut();
                },
                events: {
                    "click .add-line": "addSingleLine",
                    "click .add-ten-line": "addTenLines",
                    "click .remove": "removeRow",
                    "keypress .skuEnter" : "skuKeyPress",
                    "click #submitUpdateCart": "updateCart",
                    "keypress .qty" : "qtyKeyPress",
                   // "focusout .qty" : "qtyFocusOut",
                },
                skuFocusOut: function(){
                    $('.skuEnter').change(function(event) {
                        $("#errDiv").addClass("hide-div");
                        $("#overlay-QuickOrder").removeClass("hide-div");
                        let skuname = event.currentTarget.name;
                        let skuVal = $('#row-'+skuname+' .skuEnter').val();
                        CCRZ.remoteActions.QuickOrderRemoting.getProductDetail(JSON.stringify({'skuVal':skuVal}),function(res,event){
                            if(res && res.data){
                                addProdsResp(res,skuname);                     
                            } else{
                                $('#row-'+skuname+' .description').text('PRODUCT NOT FOUND');
                                $('#row-'+skuname+' .availability').text('');
                                $('#row-'+skuname+' .price').text('');
                            }
                            $("#overlay-QuickOrder").addClass("hide-div");
                        });
                    });
                   
                },
                qtyKeyPress: function(event){
                    let rowNum = event.currentTarget.name;
                    let nextRow = parseInt(rowNum) + 1;
                    let qtyVal = $('#row-'+rowNum+' .qty').val();
                    let keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode == '13'){
                        if(qtyVal != ''){
                            let result = this.qtyNegativeCheck(event);
                            if(!result){
                                $('#row-'+nextRow+' .skuEnter').focus();
                            }    
                        }
                    }
                },
                qtyFocusOut: function(){
                    $('.qty').change(function(event) {
                        $("#errDiv").addClass("hide-div");
                        $("#overlay-QuickOrder").removeClass("hide-div");
                        let rowNum = event.currentTarget.name;
                        let nextRow = parseInt(rowNum) + 1;
                        let qtyVal = $('#row-'+rowNum+' .qty').val();
                        if(qtyVal != ''){
                            if(parseInt(qtyVal)<=0){
                                isError = true;
                                $("#errDiv").removeClass("hide-div");
                                $('#errDiv').text('Please enter a valid quantity value');
                            } else{
                                isError = false;
                                $("#errDiv").addClass("hide-div");
                            }  
                            $("#overlay-QuickOrder").addClass("hide-div");
                        }
                    });
                    $("#overlay-QuickOrder").addClass("hide-div");
                },
                qtyNegativeCheck: function(event){
                    let rowNum = event.currentTarget.name;
                    let qtyVal = $('#row-'+rowNum+' .qty').val();
                    let isError = false;
                    if(parseInt(qtyVal)<=0){
                        isError = true;
                        $("#errDiv").removeClass("hide-div");
                        $('#errDiv').text('Please enter a valid quantity value');
                    } else{
                        isError = false;
                        $("#errDiv").addClass("hide-div");
                    }
                    return isError;
                },
                skuKeyPress: function(event){
                    let skuname = event.currentTarget.name;
                    let skuVal = $('#row-'+skuname+' .skuEnter').val();
                    let keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode == '13'){
                        if(skuVal != ""){
                            $("#overlay-QuickOrder").removeClass("hide-div");
                            $("#errDiv").addClass("hide-div");
                            CCRZ.remoteActions.QuickOrderRemoting.getProductDetail(JSON.stringify({'skuVal':skuVal}),function(res,event){
                                if(res && res.data){
                                    addProdsResp(res,skuname);
                                } else{
                                    $('#row-'+skuname+' .description').text('PRODUCT NOT FOUND');
                                    $('#row-'+skuname+' .availability').text('');
                                    $('#row-'+skuname+' .price').text('');
                                }
                                $("#overlay-QuickOrder").addClass("hide-div");
                            });
                        }
                    }
                },
                updateCart: function(event){
                    $("#overlay-QuickOrder").removeClass("hide-div");
                    $("#errDiv").addClass("hide-div");
                    let skuArr=[];
                    let qtyArr=[];
                    var skuQtyMap = new Map();
                    var isError = true;
                    var isRun = false;
                    var customers = new Array();
                    $(".skuEnter").each(function() {
                        if($(this).val() != ""){
                            isRun = true;
                            let descVal = $(this).parent().siblings('.description').text();
                            let qtyVal = $(this).parent().siblings('.qtyCount').children().val();
                            if(descVal != 'PRODUCT NOT FOUND'){
                                if(qtyVal != "" && !isNaN(qtyVal) && (parseInt(qtyVal) > 0)){    
                                    skuArr.push($(this).val());
                                    qtyArr.push(qtyVal);
                                    skuQtyMap.set($(this).val(),qtyVal);
                                    var customer = {};
                                    customer.sku = $(this).val();
                                    customer.qty = qtyVal;
                                    customers.push(customer);
                                    isError = false;
                                } else{
                                    isError = true;
                                    $("#errDiv").removeClass("hide-div");
                                    $('#errDiv').text('Please enter a valid quantity value');
                                    return false;
                                }
                            } 
                        }else{
                            $("#errDiv").removeClass("hide-div");
                        }
                    });
                    if(!isError){
                        $("#errDiv").addClass("hide-div");
                        CCRZ.remoteActions.QuickOrderRemoting.updateCart(JSON.stringify({'skuArr':skuArr,'qtyArr':qtyArr,'skuQtyMap':customers}),function(res,event){
                            if(res && res.data){
                                let sitePrefix = CCRZ.pagevars.sitePrefix; 
                                location.href= location.origin+sitePrefix+'/ccrz__Cart';
                            }else{
                                $("#overlay-QuickOrder").addClass("hide-div");
                            }
                        });
                    }else{
                        $("#overlay-QuickOrder").addClass("hide-div");
                        $("#errDiv").removeClass("hide-div");
                        if(isRun)
                        $('#errDiv').text('Please enter a quantity value');
                        else
                            $('#errDiv').text('Please enter a value');
                    }
                },
                removeRow: function(event){
                    $("#errDiv").addClass("hide-div");
                    let rowID = event.currentTarget.id;
                    $('#row-'+rowID).remove();
                    removedSize = sumOfArray - 1;
                    sumOfArray = removedSize;
                        for(i=1;i<sumOfArray+1;i++){
                            $(".line").each(function() {
                                $(this).text(i);
                                i++;
                            });
                        }
                    
                },
                addSingleLine: function(event){
                    let singleArray = [];
                    let prevSize = sumOfArray;
                    let newSize = prevSize + 1;
                    singleArray.push(newSize);
                    CCRZ.models.customQuickOrderModel.set('singleArray',singleArray);
                    sumOfArray = singleArray[0];
                    CCRZ.models.customQuickOrderModel.set('sumOfArray',sumOfArray);

                    var newRow =
                    '<tr id="row-'+newSize+'">' +
                        '<td class="line" >' + newSize + '</td>' +
                        '<td><input type="text" class="skuEnter" name="' + newSize + '"/></td>' +
                        '<td class="description"></td>' +
                        '<td class="qtyCount"><input type="text" class="qty" name="qty' + newSize + '"/></td>' +

                        '<td class="availability"></td>' +
                        '<td class="td-price price"></td>' +
                        '<td class="td-price retail"></td>' +

                        '<td><a class="remove" id="'+newSize+'"><img  id="delete"  src="https://www.wescoturf.com/modules/quickorderreference/img/delete.gif" alt="delete" class="delete"></a></td>' +
                    '</tr>';
                    $('table.stats tr:last').after(newRow);

                    this.skuFocusOut();
                    this.qtyFocusOut();
                },
                addTenLines: function(event){
                    let prevSize = sumOfArray;
                    let newSize = prevSize;
                    for(i=0; i<10;i++){
                        sumOfArray++;
                        newSize++;
                        var newRow =
                    '<tr id="row-'+newSize+'">' +
                        '<td class="line" >' + sumOfArray + '</td>' +
                        '<td><input type="text" class="skuEnter" name="' + sumOfArray + '"/></td>' +
                        '<td class="description"></td>' +
                        '<td class="qtyCount"><input type="text" class="qty" name="qty' + sumOfArray + '"/></td>' +

                        '<td class="availability"></td>' +
                        '<td class="td-price price"></td>' +
                        '<td class="td-price retail"></td>' +

                        '<td><a class="remove" id="'+newSize+'"><img  id="delete"  src="https://www.wescoturf.com/modules/quickorderreference/img/delete.gif" alt="delete" class="delete"></a></td>' +
                    '</tr>';
                    $('table.stats tr:last').after(newRow);
                    }
                    this.skuFocusOut();
                    this.qtyFocusOut();
                }
            });
            setTimeout(() => {
                CCRZ.models.customQuickOrderModel = new CCRZ.models.customQuickOrderModel();
                CCRZ.views.customQuickOrderView = new CCRZ.views.customQuickOrderView();
            },1000);
            function unescapedHtml(){
                return $("<span />", { html: arguments[0] }).text();
            }
            function addProdsResp(res,skuname){
                if(res.data.pastSku != ""  && res.data.AlreadyExist != ""){
                    $('#row-'+skuname+' .skuEnter').val(res.data.prodList[0].B2B_Superceded_Product__r.ccrz__SKU__c);
                    $('#row-'+skuname+' .description').html(unescapedHtml(res.data.prodList[0].B2B_Superceded_Product__r.Name)+'<br/> ALREADY EXISTS '+res.data.AlreadyExist+' ITEMS ON CART.<br/> This Part replaced '+ res.data.pastSku);
                } else if(res.data.pastSku != ""){
                    $('#row-'+skuname+' .skuEnter').val(res.data.prodList[0].B2B_Superceded_Product__r.ccrz__SKU__c);
                    $('#row-'+skuname+' .description').html(unescapedHtml(res.data.prodList[0].B2B_Superceded_Product__r.Name) +'<br/>'+'This Part replaced '+ res.data.pastSku);
                } else if(res.data.AlreadyExist != ""){
                    $('#row-'+skuname+' .description').html(unescapedHtml(res.data.prodList[0].Name)+'<br/> ALREADY EXISTS '+res.data.AlreadyExist+' ITEMS ON CART.');
                } else{
                    $('#row-'+skuname+' .description').text(unescapedHtml(res.data.prodList[0].Name));
                }
                if(res.data.respWrapper != ''){
                    $('#row-'+skuname+' .availability').text(res.data.respWrapper.AvailLinesResult[0].AvailableMain);
                }
                if(res.data.externallyPriced && res.data.respWrapper !=""){
                    CCRZ.models.customQuickOrderModel.AvailLinesResult =  res.data.respWrapper.AvailLinesResult;
                    $('#row-'+skuname+' .price').text(res.data.respWrapper.AvailLinesResult[0].CustomerPrice);
                    $('#row-'+skuname+' .retail').text(res.data.respWrapper.AvailLinesResult[0].SuggestedRetailPrice);
                } else {
                    $('#row-'+skuname+' .price').text(res.data.plListItem[0].ccrz__Price__c);
                    //$('#row-'+skuname+' .retail').text(res.data.respWrapper.AvailLinesResult[0].SuggestedRetailPrice);
                } 
                $('#row-'+skuname+' .qty').focus();
            }
        }
    }
});