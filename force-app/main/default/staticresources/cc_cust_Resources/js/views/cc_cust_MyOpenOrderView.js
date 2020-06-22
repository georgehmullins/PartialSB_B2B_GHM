d("MyOpenOrderView",['ccrz', 'util','customMyOpenOrderModel'], function(CCRZ, util,customMyOpenOrderModel) {

    return {
        extendMyOpenOrderView: function() {
        
            CCRZ.MyAccount = _.extend(CCRZ.MyAccount||{},{
                MyOpenOrder :{
                    register : function(registrar){
                        registrar.registerNewView('openOrders', CCRZ.pagevars.pageLabels['MyAccount_MyOpenOrder'], new CCRZ.views.MyOpenOrderView());
                    }
                }
            });
            
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{});  
            CCRZ.views.MyOpenOrderView = CCRZ.CloudCrazeView.extend({
                    viewName: "MyOpenOrderView",
                    managedSubView : true,
                    orderTemplate: CCRZ.util.template(CCRZ.uiProperties.MyOpenOrderView.tmpl),
                    init:function(){
                        var v = this;
                        CCRZ.custom.models.customMyOpenOrderModel = new CCRZ.models.customMyOpenOrderModel();
                        this.model = CCRZ.custom.models.customMyOpenOrderModel;
                        
                        this.model.fetch(JSON.stringify({}),function(res,event){
                            if(res && res.data){
                                this.model = CCRZ.custom.models.customMyOpenOrderModel;
                               // v.render();
                                isorderAjaxFired = true;
                                orders = res.data.orders;
                            } 
                        });
                    
                    },
                    render: function(){
                        let v = this;
                        if(orders.length ==0 && !isorderAjaxFired){
                            CCRZ.subsc.Myaccount.getOpenOrder(JSON.stringify({}),function(res,event){
                                if(res && res.data){
                                    
                                    orders = res.data.orders;
                                    v.render();
                                    isorderAjaxFired = true;
                                } 
                            });
                        }else{
                            this.$el.html(this.orderTemplate({orders : orders}));

                        }
                        
                    },
                    getOpenOrder: function(){
                        CCRZ.subsc.Myaccount.getOpenOrder(JSON.stringify({}),function(res,event){
                            if(res && res.data){
                                //this.model = CCRZ.custom.models.customMyOpenOrderModel;
                                //v.render();
                                //this.orders = res.data.orders;
                                this.$el.html(this.orderTemplate({orders : res.data.orders}));
                                this.isAjaxFired = true;
                            } 
                        });
                    }
                    
            }); 
        }
        
    } 
});


