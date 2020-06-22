d("customOpenOrderView", ["ccrz", "util", "customOpenOrderModel"], function(CCRZ, UTIL, customOpenOrderModel) {
    CCRZ.custom = _.extend(CCRZ.custom||{}); 
    CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
    CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
    CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

    CCRZ.views.customOpenOrderView = CCRZ.CloudCrazeView.extend({
        el: CCRZ.uiProperties.customOpenOrderView.desktop.selector,
        viewName: "customOpenOrderView",
        //templateLeadDesktop: CCRZ.util.template(CCRZ.uiProperties.customCasesView.desktop.tmpl.lead),
        templateDesktop: CCRZ.util.template(CCRZ.uiProperties.customOpenOrderView.desktop.tmpl),
        init: function() {
            var v = this;
            CCRZ.models.customOpenOrderModel = new CCRZ.models.customOpenOrderModel();
            this.model = CCRZ.models.customOpenOrderModel;
            
            let oid = CCRZ.pagevars.queryParams.oid;
            let adni = CCRZ.pagevars.queryParams.adni;
            if(oid !=""){
                let reqData ={"oid":oid,"adni":adni};
                this.model.fetch(JSON.stringify(reqData),function(res,event){
                    if(res && res.data){
                        this.model = CCRZ.models.customOpenOrderModel;
                        // v.render();
                        orders = res.data.order;
                        this.model.set('orders',orders);
                        v.render();
                    } 
                });
            }
        },
        events: {
            "click .orderHistory": "gotoOrderHistory"
        },
        render:function(){
            this.$el.html(this.templateDesktop(this.model.toJSON()));
        },
        gotoOrderHistory: function() {
            let url = CCRZ.pagevars.currSiteURL+'ccrz__MyAccount?viewState=openOrders&cartID='+CCRZ.pagevars.currentCartID + getCSRQueryString();
            document.location = url;
        },
    });

});