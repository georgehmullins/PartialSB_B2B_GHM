//
// Theme driven uiProperties overrides.  If you want to override elements
// of uiProperties within this file then
// 1) Uncomment the code between //OVERRIDES START HERE and
//                               //OVERRIDES END HERE
// 2) Define the specific property(ies) that you wish to
//    override from the managed package.
//
// Note that you must override according to the full object path
// but you can only override specific values, i.e. you do not need
// to provide the whole object copy.
//
// OVERRIDES START HERE
 CCRZ.uiProperties = $.extend(true,CCRZ.uiProperties,{
//     //Overriden partial objects here
    productListPageView : {
        desktop: {
            selector: ".desktop_body",
            tmpl: "Product-List-Page-View"
        },
        footer: {
            selector: ".productListFooter",
            tmpl: "cc_cust_PLP_Footer.handlebars"
        },
        header: {
            selector: ".productListHeader",
            tmpl: "cc_cust_PLP_Header.handlebars"
        },
        partials:{
            noResultsDisplay: "#noResultsDisplay"
        },
        productItem: {
            grid: {tmpl: "cc_cust_PLP_GridView.handlebars"},
            list: {tmpl: "cc_cust_PLP_ListView.handlebars"}
        },
        productItems: {
            selector: ".productListContent"
        }
    },
    productDetailView: {
        desktop: {
            tmpl: "cc_cust_PDP.handlebars",
            main: {
                selector: '.prodDetailContainer'    
            },
            right: {
                selector: '.right_column .widgetSection'  
            }
        }

    },
    CartDetailView: {
        desktop: {
            tmpl: "cc_cust_cartDetail.handlebars",
            selector: ".cartContainer"
        },
        partials: {
            cartItemsDesktop: "#cartItemsDesktop",
            actionsTotals: "#actionsTotals",
            cartItemsQty: "#cartItemsQty"
        }
    },
    CheckoutNav: {
        desktop: {
            selector: ".home_slider",
            tmpl: "cc_cust_checkoutHeader.handlebars"
        }
    },
    OrderReviewView: {
        desktop: {
            tmpl: "cc_cust_CheckoutOrderReview.handlebars"
        }
    },
    CartOrderReviewView: {
        desktop: {
            tmpl: "cc_cust_CO_ReviewCart.handlebars"
        }
    },
    CartOrderReviewViewV2: {
        desktop: {
            tmpl: "cc_cust_CO_ReviewCartV2.handlebars"
        }
    },
    customPartStreamView:{
        desktop : {
            tmpl: 'cc_cust_partStream.handlebars',
            selector: '.partStream_body',
        },
        phone : {
            tmpl: 'cc_cust_partStream.handlebars',
            selector: '.partStream_body',
        },
    },
    customQuickOrderView:{
        desktop : {
            tmpl: 'cc_cust_quickOrder.handlebars',
            selector: '.quickOrder_body',
        },
        phone : {
            tmpl: 'cc_cust_quickOrder.handlebars',
            selector: '.quickOrder_body',
        },
    },
    quoteDetailView:{
        desktop : {
            tmpl: 'cc_dcm_quoteDetailView.handlebars',
            selector: '.quote-container',
        },
        phone : {
            tmpl: 'cc_dcm_quoteDetailView.handlebars',
            selector: '.quote-container',
        },
    },
    OrderDetailView:{
        desktop:{
            selector: ".orderContainer",
            tmpl: "cc_cust_orderDetails.handlebars"
        },
        partial:{
            orderItemsDesktop: "#orderItemsDesktop",
            addressDisplay: "cc_cust_addressDisplay-Partial.handlebars"
        }
    },
    myAddressBookView : {
        desktop : {
            tmpl: "cc_cust_MyAccountAddressBookDesktop.handlebars"
        }
    },
    MyOpenOrderView : {
        tmpl : "cc_cust_MyOpenOrders.handlebars"
    },
    myInvoicesView : {
        desktop : {
            tmpl : "cc_cust_MyAccount-MyInvoices-Desktop.handlebars"
        }
        
    },
    customMassOrderView:{
        desktop : {
            tmpl: 'cc_cust_massOrder.handlebars',
            selector: '.massOrder_body',
        },
        phone : {
            tmpl: 'cc_cust_massOrder.handlebars',
            selector: '.massOrder_body',
        },
    },
    customCasesView:{
        desktop : {
            tmpl: {
                case : 'cc_cust_caseSupport.handlebars',
            },
            selector: '.SupportCaseContainer',
        },
    },
    customOpenOrderView:{
        desktop : {
            tmpl: 'cc_cust_openOrder.handlebars',
            selector: '.openOrder_body',
        }
    },
    registerPageView :{
        tmpl: "cc_cust_newCustomerView.handlebars",
        el: ".RegisterPageDesktop"
    },
    contactUs:{
        desktop : {
            tmpl: {
                lead : 'cc_cust_webLead.handlebars',
            },
            selector: '.SupportLeadContainer',
        },
    },
    myOrdersView: {
        desktop: {
            tmpl : 'cc_cust_myOrderHistory.handlebars'
        }
    },
    Menu :{
        desktop:{
            tmpl: "cc_cust_menuDesktop.handlebars",
                
            }
    },
    CheckoutPaymentView : {
        PaymentProcessor: {
            desktop: {
                tmpl: "cc_cust_PaymentProcessor-Desktop.handlebars"
            },
            phone: {
                tmpl: "cc_cust_PaymentProcessor-Desktop.handlebars"
            }
        }
    },
   
 });



// OVERRIDES END HERE