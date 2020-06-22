d("productListPageView",['util',], function(UTIL,productListPageView) {

    return {

        extendproductListPageView: function() {
            CCRZ.productListPageViewWasRendered = false;
            CCRZ.pubSub.on("view:productListPageView:refresh", function(view) {
                CCRZ.productListPageViewWasRendered = true;
                CCRZ.productListPageView.headerView.setElement(CCRZ.uiProperties.productListPageView.header.selector);
                CCRZ.productListPageView.productItemsView.setElement(CCRZ.uiProperties.productListPageView.productItems.selector);
                CCRZ.productListPageView.footerView.setElement(CCRZ.uiProperties.productListPageView.footer.selector);
            });
            CCRZ.pubSub.on("view:productListFilterView:refresh", function(filterView) {
                filterView.specGroupsView.setElement(CCRZ.uiProperties.productListFilterView.ListView.selector);
            });
            CCRZ.pubSub.on("action:productsPageRenderAllViews", function() {
                CCRZ.productListPageView.render();
                CCRZ.productListPageView.headerView.render();
                CCRZ.productListPageView.productItemsView.render();
                CCRZ.productListPageView.footerView.render();
                CCRZ.productListFilterView.specGroupsView.render(); /// Add it for  for Product Specs
            }); 
        }   
    }
    function openProductDetail(e){
        let dataid  = e.target.getAttribute('data-Id');
        $('[data-id=product_Link_'+dataid+'] a').click();
    }
    function overridenAddItem (e){
        var qtyInput = $("#" + this.model.get('sfid') + "_qtyEntry");
        var qty = qtyInput.val();
        var productId = this.model.get('sfid');
        var sellerId = !_.isUndefined(this.model.get('sellerID')) ? this.model.get('sellerID') : '';
        var incr = parseInt(this.model.get('qtySkipIncrement'));
        var scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
        if(qty !== scrubbedQty || qty < 1) {
            CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-"+this.model.get('sfid'), 'Invalid_Qty'));
            qtyInput.val(scrubbedQty);
        } else {
            this.className = 'cc_RemoteActionController';
            this.processAddItem(productId,qty,sellerId);
        }
}
    function addToCartKey(event){
        var v = this;
        if (window.event && window.event.keyCode == 13 || event.which == 13) {
                $('.cc_add_to_btn_'+event.target.getAttribute('Id').replace('_qtyEntry','')).click();
            return false;
        } else {
            return CCRZ.util.isValidNumericInput(event);
        }
    };
});