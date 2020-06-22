d("customQuotesView",['ccrz', 'util',], function(CCRZ, UTIL) {
    return{
        extendPendingApprovalOrderView: function() {
                CCRZ.views.myQuotesView = CCRZ.CloudCrazeView.extend({
                    templatePhone : CCRZ.util.template('MyQuotesViewSection'),
                    templateDesktop : CCRZ.util.template('MyQuotesViewSection'),
                    managedSubView : true,
                    viewName : "myQuotesView",
                    init : function(){
                        this.detailsView = new CCRZ.views.myQuotesDetailView();
                    },
                    initSetup : function(callback){
                        callback();
                    },
                    renderPhone : function() {
                        this.$el.html(this.templatePhone(this));
                    },
                    renderDesktop : function() {
                        this.$el.html(this.templateDesktop(this));
                        CCRZ.subsc.MyRemote.getQuotes();
                    },
                    events: {
                        "click .gotoDetails" : "gotoDetails",
                    },
                    gotoDetails: function (event) {
                        var objLink = $(event.target);
                        var quoteId = objLink.data("id");
                        //var selList = this.wishlistData.get(id);
                        this.detailsView.generateDisplay(quoteId,this.$el);
                        //this.detailsView.generateDisplay();
                    },
            });
        }
    }
});