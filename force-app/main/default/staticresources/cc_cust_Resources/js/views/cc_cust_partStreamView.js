d("customPartStreamView",['ccrz', 'util', 'customPartStreamModel'], function(CCRZ, UTIL, customPartStreamModel) {
    return{
        extendcustomPartStreamView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

            

            CCRZ.views.customPartStreamView = CCRZ.CloudCrazeView.extend({
                el: CCRZ.uiProperties.customPartStreamView.desktop.selector,
                viewName: "customPartStreamView",
                partStreamTemplate: CCRZ.util.template(CCRZ.uiProperties.customPartStreamView.desktop.tmpl),
                init: function(){
                    CCRZ.custom.models.customPartStreamModel = new CCRZ.models.customPartStreamModel();
                    //this.model = CCRZ.custom.models.customPartStreamModel;
                    b2bAddToCart(b);
                    $("#ariPartStream").appendTo("#parts_content");
                },
                render: function(){
                    $("#ariPartStream").appendTo("#parts_content");
                    this.$el.html(this.partStreamTemplate(this.model.toJSON()));
                },
                b2bAddToCart: function(b){
                    console.log('hi__'+b);
                }
            });
        }
    }
});
