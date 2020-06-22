jQuery(function($) {
    if(CCRZ.pagevars.pageConfig.isTrue('pcc.pageloader.enabled')){
        TOTAL_COUNT = 0;

        var showLoader = function() {
            if(TOTAL_COUNT == 0){
                $(".loading_cover").addClass('show');
                setTimeout(function(){
                    if(!$(".loading_cover").children().hasClass("animated")){
                        $(".loading_cover").children().addClass("animated");
                    }
                }, 50);
            }
        };

        var hideLoader = function(){
            setTimeout(function(){
                if(TOTAL_COUNT <= 0){
                    $(".loading_cover").removeClass('show');
                }
            }, CCRZ.pagevars.pageConfig.get('pcc.pageloader.timeout') ? CCRZ.pagevars.pageConfig.get('pcc.pageloader.timeout') : 7000);
        };


        var loadPageLoader = function(){
            showLoader();
            TOTAL_COUNT++;
        };

        var unloadPageLoader = function(){
            TOTAL_COUNT--;
            hideLoader();
        };

       var remotesWithoutCover = ['addItem','fetchCartComponentData','clearCart','fetchMiniCart','removeItem','changeQuantity'],
            remoteInv = CCRZ.RemoteInvocation,
            _invokeCtx = remoteInv.invokeCtx,
            _invokePageLoadingCtx = remoteInv.invokePageLoadingCtx,
            _invokeContainerLoadingCtx = remoteInv.invokeContainerLoadingCtx,
            _responsePageLoading = remoteInv.responsePageLoading,
            _responseContainerLoading = remoteInv.responseContainerLoading,
            _response = remoteInv.response;

        remoteInv.invokeCtx = function(){
            if(arguments && arguments[0] && (remotesWithoutCover.indexOf(arguments[0]) < 0)){
                loadPageLoader();
            }
            _invokeCtx.apply(this, arguments);
        }
        remoteInv.invokePageLoadingCtx = function(){
            loadPageLoader();
            _invokePageLoadingCtx.apply(this, arguments);
        }
        remoteInv.invokeContainerLoadingCtx = function(){
            loadPageLoader();
            _invokeContainerLoadingCtx.apply(this, arguments);
        }
        remoteInv.responsePageLoading = function(){
            unloadPageLoader();
            _responsePageLoading.apply(this, arguments);
        }
        remoteInv.responseContainerLoading = function(){
            unloadPageLoader();
            _responseContainerLoading.apply(this, arguments);
        }
        remoteInv.response = function(){
            if(arguments && arguments[1] && arguments[1].method && (remotesWithoutCover.indexOf(arguments[1].method) < 0)){
                unloadPageLoader();
            }
            _response.apply(this, arguments);
        }

         CCRZ.CloudCrazeModel = Backbone.Model.extend(CCRZ.RemoteInvocation).extend({});
         CCRZ.CloudCrazeCollection = Backbone.Collection.extend(CCRZ.RemoteInvocation).extend({});
    }
 });
