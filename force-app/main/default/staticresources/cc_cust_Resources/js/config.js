var CCDP = {};
CCDP.init = (function(resourcesPath){
	window.r = require;
    window.require = undefined;
    window.d = define;
    window.define = undefined;
	    r.config({
		    baseUrl: resourcesPath,
			paths: {
					log : 'js/utils/log',
					helpers : 'js/utils/helpers',
					config : 'js/models/config',
					text : 'vendors/requirejs.text/text',
					util : 'js/utils/util',
					headerView : 'js/views/cc_cust_headerView',
					footerView : 'js/views/cc_cust_footerView',
					registerPageView: 'js/views/cc_cust_registerPageView',
					registerPageModel: 'js/models/cc_cust_registerPageModel',
					contactUsPageView: 'js/views/cc_dcm_contactUsView',
					contactUsPageModel: 'js/models/cc_dcm_contactUsPageModel',
					productDetailView : 'js/views/cc_cust_productDetailsView',
					orderDetailView : 'js/views/cc_cust_orderDetailView',
					cartOrderReviewView :'js/views/cc_cust_orderReview',
					ShippingView : 'js/views/cc_cust_ShippingView',
					PaymentProcessorView : 'js/views/cc_cust_PaymentProcessorView',
					productListPageView  : 'js/views/cc_cust_productListPageView',
					customPDPView  : 'js/views/cc_cust_productDetailView',
					customPDPModel: 'js/models/customPDPModel',
					customCartDetailView: 'js/views/cc_cust_cartDetailView',
					customCartDetailModel: 'js/models/customCartDetailModel',
					customCheckOutView: 'js/views/cc_cust_checkOutView',
					customCheckOutModel: 'js/models/customCheckOutModel',
					customPartStreamView: 'js/views/cc_cust_partStreamView',
					customPartStreamModel: 'js/models/customPartStreamModel',
					customQuickOrderView: 'js/views/cc_cust_quickOrderView',
					customQuickOrderModel: 'js/models/customQuickOrderModel',
					QuickOrderView: 'js/views/cc_cust_QuickOrderView',
					MyOpenOrderView: 'js/views/cc_cust_MyOpenOrderView',
					customMyOpenOrderModel: 'js/models/customMyOpenOrderModel',
					customMassOrderView: 'js/views/cc_cust_massOrderView',
					customMassOrderModel: 'js/models/customMassOrderModel',
					customCasesView : 'js/views/cc_cust_CasesView',
					customOpenOrderView : 'js/views/cc_cust_openOrder',
					customOpenOrderModel : 'js/models/customOpenOrderModel',
					registerPageView: 'js/views/cc_cust_registerPageView',
					registerPageModel: 'js/models/cc_cust_registerPageModel',
					customOrderDetailView: 'js/views/cc_cust_OrderDetailView',
					contactUs:'js/views/cc_cust_ContactUs',
            }
		});
        d('hbs',Handlebars);
        d('ccrz',CCRZ);
        d('backbone',Backbone);
});