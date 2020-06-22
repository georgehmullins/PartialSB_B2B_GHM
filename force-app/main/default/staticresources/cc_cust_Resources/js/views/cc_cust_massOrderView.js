d("customMassOrderView",['ccrz', 'util', 'customMassOrderModel'], function(CCRZ, UTIL, customMassOrderModel) {
    return{
        extendcustomMassOrderView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});
            CCRZ.remoteActions.MassOrderRemoting =  _.extend(CCRZ.RemoteInvocation,{ 
                className : 'B2B_masssOrder_controller', 
                addToCartByCsv : function( reqData,callback){ 
                    this.invokeCtx('addToCartByCsv', 
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

            let csvRetrieved;
            CCRZ.views.customMassOrderView = CCRZ.CloudCrazeView.extend({
                el: CCRZ.uiProperties.customMassOrderView.desktop.selector,
                viewName: "customMassOrderView",
                massOrderTemplate: CCRZ.util.template(CCRZ.uiProperties.customMassOrderView.desktop.tmpl),
                
                init: function(){   
                    this.model = CCRZ.models.customMassOrderModel;
                    this.render();
                },
                render: function(){
                    this.$el.html(this.massOrderTemplate());
                },
                events: {
                    "click #uploadCsv": "uploadCsv",
                    "change #myfile": "uploading"
                },
                uploading: function(event){
                    var data = null;
                var file = event.target.files[0];
                if(file == undefined){
                    csvRetrieved = null;

                }else{
                    var reader = new FileReader();
                    reader.readAsText(file);
                        reader.onload = function(event) {
                            var csvData = event.target.result; //alert(csvData);
                            var data2 = csvData.split("\r\n");
                            csvRetrieved = data2;
                        } 
                    }
                },
                uploadCsv: function(event){
                    console.log('hi'+csvRetrieved);
                    if(csvRetrieved != undefined){
                        $('.messagingSection-Error').hide();
                        $("#overlay-massOrder").removeClass("hide-div");
                        var customers = new Array();
                        var rows = csvRetrieved;
                        var customers = new Array();
                        for (var i = 0; i < rows.length; i++) {
                            var cells = rows[i].split(",");
                            if (cells.length > 1) {
                                var customer = {};
                                customer.sku = cells[0];
                                customer.qty = cells[1];
                                customers.push(customer);
                            }
                        } 
                        console.log('df'+customers);
                        CCRZ.remoteActions.MassOrderRemoting.addToCartByCsv(JSON.stringify({'csvArray':customers}),function(res,event){
                            if(res && res.data){
                                let sitePrefix = CCRZ.pagevars.sitePrefix; 
                                location.href= location.origin+sitePrefix+'/ccrz__Cart';
                            }
                        }); 
                    } else{
                        CCRZ.pubSub.trigger('pageMessage',{messages:[
                            {
                                type : 'CUSTOM',
                                labelId : 'B2B_noFileChosen',
                                severity : 'ERROR',
                                classToAppend : 'messagingSection-Error'
                            }
                        ]});
                    }               
                }
            });
            setTimeout(() => {
                CCRZ.models.customMassOrderModel = new CCRZ.models.customMassOrderModel();
                CCRZ.views.customMassOrderView = new CCRZ.views.customMassOrderView();
            },1000);
        }
    }
});