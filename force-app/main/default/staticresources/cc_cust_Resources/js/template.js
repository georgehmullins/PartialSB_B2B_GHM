/**
  * Customization of OOTB CCRZ.util.template function. This function is used for load template content by views.
  * Originally function accepts html selector where template is included into page body. Customization introduces
  * possibility to load template from external file from path: js/templates. To make it works template namespace
  * should has '.handlebars' suffix. In example: CCRZ.uiProperties.headerView.desktop.tmpl = 'cc_cust_HeaderDesktop.handlebars'
  */
jQuery(function($) {
            var parent = CCRZ.util.template;
            CCRZ.util.template = function(id){
                if (Handlebars && Handlebars.templates && typeof Handlebars.templates[id.replace('.handlebars','')] === 'function' ){
                    return Handlebars.templates[id.replace('.handlebars','')];
                 }

                var moduleName = 'text!js/templates/' + id;
                if( id.match(".handlebars$")==".handlebars" ){
                    r([moduleName],function(template){
                        CCDP[id] = template;
                    });
                    var templateId = id;
                    var getTemplate = function(id){
                        if(CCDP[templateId]==undefined){
                            return moduleName;
                        }
                        return Handlebars.compile(CCDP[templateId])(id);
                    }
                    return getTemplate;
                }
                else{
                    return parent(id);
                }
        }
});
