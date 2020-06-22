/**
  * Customization of OOTB CloudCrazeView that is used for register custom handlebars helpers before first render of
  * cloud craze view. Custom Handlebars helpers are included into js/utils/template
  */
jQuery(function($) {


    var loadedPartials = [];
    /*
    * function is overridden to handle situation when passed html was undefined,
    * issue occurs when in UI properties
    * partial template is defined as handlebar template instead of html selector
    */
    var _registerPartial = Handlebars.registerPartial;
    Handlebars.registerPartial = function(){
        if (Handlebars && Handlebars.partials && typeof Handlebars.partials[arguments[0]] === 'function' ){
            return;
         }
        if(arguments[1] == undefined){

            var handlebarFilePrefix = 'cc_cust_',
                handlebarFileExtension = '-Partial.handlebars',
                partialViewName = arguments[0],
                filename = handlebarFilePrefix+partialViewName+handlebarFileExtension,
                registerPartialsArguments = arguments,
                that = this;
            loadedPartials.push('text!js/templates/'+filename);

            r(['text!js/templates/'+filename],function(temp){
                registerPartialsArguments[1] = temp;
                _registerPartial.apply(that,registerPartialsArguments);
            })
        }else{
           _registerPartial.apply(this,arguments);
        }
    };


    var initHelpers = function(theView,theHelpers,innerIndex, callback){
        theHelpers.registerHelpers();
        r(loadedPartials, function(){
            /*if(theView.viewName == 'productListHeader' || theView.viewName == 'productListFooter' || theView.viewName == 'productItemsView'){
                debugger;
                if(theView.viewName == 'productListHeader'){
                    theView.el = CCRZ.uiProperties.productListPageView.header.selector;
                } else if(theView.viewName == 'productListFooter'){
                    theView.el = CCRZ.uiProperties.productListPageView.footer.selector;
                } else if(theView.viewName == 'productItemsView'){
                    theView.el = CCRZ.uiProperties.productListPageView.productItems.selector;
                }
            }*/

            var compiledTemplates = [ theView.templateDesktop, theView.templateCartHeaderDesktop, theView.deskBannerTemplate,
            theView.desktopTemplate,
            theView.templateMyAccountDesktop, theView.templateDesktopOverride, theView.deskTemplate, theView.template  ];
            if(theView.viewName == 'PageHeaderView' || theView.viewName == 'PageFooterView') {
                //console.log(theView.viewName + ' compiledTemplates : ' + compiledTemplates);
            }
            var compiledTemplate = _.find(compiledTemplates,function(e){
                if(theView.viewName == 'productListPageView' || theView.viewName == 'productListHeader') {
                    //console.log(theView.viewName + ' compiledTemplate e : ' + e);
                }
                return (e!=undefined) && (e!=false);
            });
            if(theView.viewName == 'productListPageView' || theView.viewName == 'productListHeader') {
                //console.log(theView.viewName + ' compiledTemplate Single : ' + compiledTemplate);
            }
            if (compiledTemplate == false){
                compiledTemplate = undefined;
            }
            if(compiledTemplate != undefined && compiledTemplate({}).match("^text!")=="text!" ){
                if(theView.viewName == 'productListPageView' || theView.viewName == 'productListHeader') {
                    //console.log(theView.viewName + ' temp: ' + compiledTemplate({}));
                }
                r([compiledTemplate({})],function(template){
                    theView._render(innerIndex, callback);
                });
            }
            else{
                theView._render(innerIndex, callback);
            }
        });
    }

    CCRZ.dynamicCustomView = [];
    var _render = function() {
       var that = this;
       var innerIndex = arguments[0];
       var callback = arguments[1];
        /*if(this.viewName == 'productListHeader' || this.viewName == 'productListFooter' || this.viewName == 'productItemsView'){
            if(this.viewName == 'productListHeader'){
                this.el = CCRZ.uiProperties.productListPageView.header.selector;
            } else if(this.viewName == 'productListFooter'){
                this.el = CCRZ.uiProperties.productListPageView.footer.selector;
            } else if(this.viewName == 'productItemsView'){
                this.el = CCRZ.uiProperties.productListPageView.productItems.selector;
            }
        }*/
       r(['helpers'], function(helpers){
            initHelpers(that,helpers,innerIndex,callback);
       });

       //recreating the CCRZ.dynamicView array from an earlier version of CC
       if(this.$el){
           var viewToSave = this;
           if(_.contains(CCRZ.dynamicCustomView, viewToSave)){
                var orginalItem = this;
                var indexOfItem = _.indexOf(CCRZ.dynamicCustomView, orginalItem)
                   if(indexOfItem >= 0){
                        var item = _.findWhere(CCRZ.dynamicCustomView, orginalItem);
                        CCRZ.dynamicCustomView[indexOfItem] = item;
                    }
           }
           else{
               CCRZ.dynamicCustomView.push(viewToSave);
           }
       }
       return this;
    };

     var _injectRender = function(args,prototype){
        if(args != undefined && args.render != undefined){
            args._render = args.render;
            args.render = _render;
        }
        else{
            args._render = function(){
                prototype.render.call(this);
            }
        args.render = _render;
        }
     }

     var _extend = Backbone.View.extend;
     Backbone.View.extend = function(){
        _injectRender(arguments[0],Backbone.View.prototype);
         return _extend.apply(this, arguments);
     };

     CCRZ.CloudCrazeView.extend = function(){
         _injectRender(arguments[0],CCRZ.CloudCrazeView.prototype);
         return _extend.apply(this, arguments);
     }

 });