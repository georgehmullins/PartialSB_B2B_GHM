d("headerView",['util'], function(UTIL,headerView) {

    return {
        extendHeaderView: function() {
            CCRZ.custom = _.extend(CCRZ.custom||{}); 
            CCRZ.custom.views = _.extend(CCRZ.custom.views||{}); 
            CCRZ.custom.models = _.extend(CCRZ.custom.models||{}); 
            CCRZ.remoteActions = _.extend(CCRZ.remoteActions||{});

            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            CCRZ.pubSub.on('view:OrderDetailView:refresh', function (view){
                $('.openOrderCustom').click(function(event){
                 let url = CCRZ.pagevars.currSiteURL+'ccrz__MyAccount?viewState=openOrders&cartID='+CCRZ.pagevars.currentCartID + getCSRQueryString();
                 document.location = url;
                });
                
            });
            if(!isMobile){
                CCRZ.pubSub.on('view:Menu:refresh', function (view){
                    $(".dropdown, .dropdown-menu").hover(function(event){
                        $(this).children(".dropdown-toggle").attr("aria-expanded","true"); 
                        $(this).addClass("open");
                    }, function(){
                        $(this).removeClass("open"); 
                    });
                });
            }
            //CCRZ.pubSub.on('view:headerView:refresh', function (view){
            Handlebars.registerHelper('sitePrefix', function(options) { 
                let sitePrefix = CCRZ.pagevars.sitePrefix;
                  return sitePrefix;
               });
            //});
        }
    }
});