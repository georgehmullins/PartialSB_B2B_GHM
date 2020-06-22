/**
 *  Namespace defines additional handlebars helpers. That could be used in whole storefront
 *
 *  <ul>
 *  <li>
 *      ifPageDisplay - render block or not depend on current ccpage
 *      <pre>
 *              {{#ifPageDisplay 'ccrz__HomePage'}}
 *              <h1>Home page</h1>
 *              {{/ifPageDisplay}}
 *      </pre>
 *  </li>
 *  <li>
 *      ifConfigValue - helpers renders block or not depend on current storefront and sales organization
 *      <pre>
 *              {{#ifConfigValue 'Checkout_DeliveryDate__c'}}
 *                  <div class="col-md-5 col-xs-12  section">
 *                      <div><label>{{pageLabelMap 'CHECKOUT_DELIVERYDATE_LABEL'}} </label></div>
 *                       <div><input type="date" name="date" /></div>
 *                  </div>
 *              {{/ifConfigValue}}
 *      </pre>
 * </li>
 *  </ul>
 */
d('helpers',['hbs', 'util'], function(Handlebars, util) {
    var initialized = false;
    return {
        registerHelpers : function(){
            if(!initialized){
                // show elements on pageName
                Handlebars.registerHelper('ifPageDisplay', function(pageName, options) {
                    if (CCRZ.pagevars.currentPageName.toLowerCase() ==  pageName.toLowerCase()) {
                        return options.fn(this);
                    }
                    else {
                        return options.inverse(this);
                    }
                });
                // show elements on pageName
                Handlebars.registerHelper('ifNotPageDisplay', function(pageName, options) {
                    return (CCRZ.pagevars.currentPageName.toLowerCase() != pageName.toLowerCase()) ? true : false;
                });
                //get value from config
                Handlebars.registerHelper('getConfig', function(str) {
                    return CCRZ.pagevars.pageConfig[str];
                });
                //check if obejct is empty
                Handlebars.registerHelper('ifObjectExistButIsEmpty', function(obj) {
                   if(obj.length == 1){
                       var isEmpty = _.isEmpty(obj[0]);
                       if (isEmpty) { return true; }
                   }
                   else if (obj.length == 0){return true; }
                   else{ return false; }
                });
                //return object size
                Handlebars.registerHelper("objectSize", function(object)
                {
                    if(object){
                        return Object.keys(object).length;
                    }
                    return null;
                });
                Handlebars.registerHelper('ifOneItemWithOneQty', function(productArray, groupModel, modelOrder){
                    var size = productArray.length;
                    var flag = false;
                    if(modelOrder){
                        var itemList = groupModel[0].attributes.EOrderItemsS[0];
                    }else{
                        var itemList = groupModel[0].attributes.ECartItemsS[0];
                    }
                    if(size == 1 && itemList){
                        var qty = itemList.quantity;
                        if(qty ==1){ flag = true;}
                    }
                    return flag;
                });
                Handlebars.registerHelper('or', function( val1, val2 ){
                    if ( val1 || val2 ) {
                        return true;
                    } else {
                        return false;
                    }
                });
                Handlebars.registerHelper('and', function( val1, val2 ){
                    if ( val1 && val2 ) {
                        return true;
                    } else {
                        return false;
                    }
                });
                Handlebars.registerHelper('subcategoryIsCurrentCategory', function(subcategories, currentCategoryId){
                    var isCurrent = false;
                    _.each(subcategories, function(subcategory) {
                        var subId = subcategory.categoryID;
                        if (subId === currentCategoryId) {
                            isCurrent = true;
                        }
                    });
                    return isCurrent;
                });
                Handlebars.registerHelper('getCurrentPLPCategoryId', function(){
                    if(CCRZ.productListPageModel && CCRZ.productListPageModel.attributes.isCategory){
                        var categoryId = CCRZ.productListPageModel.attributes.category.categoryID;
                        return categoryId;
                    } else if(CCRZ.productListPageModel && CCRZ.productListPageModel.attributes.isSearch){
                        return '';
                    }
                });
                Handlebars.registerHelper('getCurrentIterationEan', function(productId, productList){
                   var item = productList[productId];
                   return item.cccustEAN;
                });
                Handlebars.registerHelper('findPaginationIdTarget', function(){
                    var target = $("[id$='pagin-target']");
                    var targetId = target.attr("id");
                    return targetId;
                });
                Handlebars.registerHelper('getNumberOfAlerts', function(){
                    if ( CCRZ.AlertView && CCRZ.AlertView.model ) {
                         return CCRZ.AlertView.model.length;
                     } else {
                         return 0;
                     }
                });
                Handlebars.registerHelper('returnListOfAttributes', function(productList, nameOfAttribute){
                    var attributeArray = [];
                    _.each(productList, function(product) {
                        attributeArray.push(product[nameOfAttribute]);
                    });
                    return attributeArray.join(', ');
                });
                Handlebars.registerHelper('getAlertsTotal', function(){
                    if ( CCRZ.AlertView && CCRZ.AlertView.model ) {
                        var cookie = CCRZ.getCookie('seenAlerts');
                        if (!cookie) {
                            cookie = [];
                            var jsonidList = JSON.stringify(cookie);
                            CCRZ.setCookieWithPath('seenAlerts', jsonidList, 30, '/');
                            var cookie = CCRZ.getCookie('seenAlerts');
                            var seen = JSON.parse(cookie);
                        } else {
                            var seen = JSON.parse(cookie);
                        }

                        var seenAmount = seen.length,
                            alerts = CCRZ.AlertView.model.length;

                        if ( seen && seenAmount > 0 ) {
                            return alerts - seenAmount;
                        } else {
                            return alerts;
                        }
                    } else {
                        return 0;
                    }
                });
                Handlebars.registerHelper('equals', function(value1, value2){
                    if (value1 === value2) {
                        return true;
                    } else {
                        return false;
                    }
                });
                Handlebars.registerHelper('ifGreaterOrEqual', function(v1, v2, options) {
                    if (v1 >= v2) {
                        return options.fn(this);
                    }
                    return options.inverse(this);
                });
                Handlebars.registerHelper('reverse', function (arr) {
                    arr.reverse();
                });
                Handlebars.registerHelper('debug2',function(data,desc){
                    console.log(data);
                    return '';
                });
                Handlebars.registerHelper('getProductType',function(){
                    return CCRZ.detailData.jsonProductData.product.prodBean.ProductType;
                });
                Handlebars.registerHelper('getResourceUrl', function(str) {
                     return CCRZ.pagevars.themeBaseURL + str;
                });
                Handlebars.registerHelper('ifPageKey', function(pageKey){
                   return (pageKey == CCRZ.getQueryParam('pageKey')) ? true : false;
                });
                Handlebars.registerHelper('getShippingProvider',function(index){
                    if ( index >= 0 && CCRZ.LLIShippingDetailModel ) {
                        var model = CCRZ.LLIShippingDetailModel.attributes.cartData.ECartItemGroupsS.models[index];
                        var shippingProvider = model.attributes.shipProvider;
                        return shippingProvider;
                    } else {
                        return Handlebars.helpers.pageLabelMap('ShippingRate_Provider_Unknown');
                    }
                });
                Handlebars.registerHelper('getShippingProviderByMethod',function(shipGroup){
                    if ( shipGroup && CCRZ.LLIShippingDetailModel ) {
                        var shippingOptions = shipGroup.shippingOptions;
                        var provider = Handlebars.helpers.pageLabelMap('ShippingRate_Provider_Unknown');
                        _.each(shippingOptions, function(option) {
                            if (option.serviceName == shipGroup.shipMethod) {
                                provider = option.provider;
                            }
                        }, shipGroup);
                        return provider;
                    } else {
                        return Handlebars.helpers.pageLabelMap('ShippingRate_Provider_Unknown');
                    }
                });
                Handlebars.registerHelper('checkIfInCartIsCoupon', function(cartItems){
                   var checkResult = false;

                   $.each(cartItems.models, function(index, element) {
                        if(element.attributes.cartItemType == 'Coupon'){
                           checkResult = true;
                        }
                   });

                   return checkResult;
                });

                Handlebars.registerHelper('allDiscount', function(cartItems){
                   var discount = 0;

                   if(Handlebars.helpers.checkIfInCartIsCoupon(cartItems)){
                       $.each(cartItems.models, function(index, element) {
                           if(element.attributes.cartItemType == 'Coupon'){
                              discount += -(element.attributes.SubAmount);
                           }
                      });
                   }else{
                        $.each(cartItems.models, function(index, element) {
                            if (element.attributes.absoluteDiscount) {
                                discount += element.attributes.absoluteDiscount;
                            }
                        });
                   }

                   return discount;
                });
                Handlebars.registerHelper('checkIfShowSaveLabels', function(cartItems){
                    var checkResult = false;
                    var checkVariable = Handlebars.helpers.allDiscount(cartItems);
                    if(checkVariable != 0){
                        checkResult = true;
                    }

                    return checkResult;
                });
                //check is mobile or width less than breakpoint
                Handlebars.registerHelper('checkMobile', function(breakpoint){
                    var screensize = $(window).width(),
                    breakpoint = Number(breakpoint);

                    return (screensize < breakpoint) ? true : false;
                });
                Handlebars.registerHelper('convertDate',function(dataToConvert){
                    var format = CCRZ.pagevars.pageLabels['Date_Format'];
                    return util.formatDate(new Date(dataToConvert),format);
                });
                Handlebars.registerHelper('compareDate',function(dateToCompare){
                    if(dateToCompare != undefined && dateToCompare != ''){
                        var todayDate = new Date(),
                            convertDate = new Date(dateToCompare);
                        return (todayDate.toLocaleDateString() < convertDate.toLocaleDateString()) ? true : false;
                    }else{
                        return false;
                    }
                });
                Handlebars.registerHelper('ifNotPastDate',function(dateToCompare){
                     if(dateToCompare != undefined && dateToCompare != ''){
                        var todayDate = new Date(),
                            convertDate = new Date(dateToCompare);
                        return (Date.parse(convertDate.toLocaleDateString()) >= Date.parse(todayDate.toLocaleDateString())) ? true : false;
                     }else{
                        return true;
                     }
                });
                Handlebars.registerHelper('isGuest', function(options){
                    if (!CCRZ.pagevars.isGuest) {
                        return options.inverse(this);
                    } else {
                        return options.fn(this);
                    }
                });
                Handlebars.registerHelper('isLoggedUser', function(options) {
                    if (CCRZ.pagevars.isGuest) {
                        return options.inverse(this);
                    } else {
                        return options.fn(this);
                    }
                });
                Handlebars.registerHelper('ifEven', function(conditional, options) {
                  if((conditional % 2) == 0) {
                    return options.fn(this);
                  } else {
                    return options.inverse(this);
                  }
                });
                Handlebars.registerHelper('strong', function(value){
                    value = value.replace(new RegExp('<em>', 'g'), '<strong>');
                    value = value.replace(new RegExp('</em>', 'g'), '</strong>');
                    return value;
                });
                Handlebars.registerHelper('productLinkSearch', function(product, styleClass, options) {
                    var SKU = '';
                    if (!_.isUndefined(product)) {
                        if (product.linkURL) {
                            SKU = product.linkURL;
                        } else if (product.sku) {
                            SKU = product.sku;
                        } else if (product.SKU) {
                            SKU = product.SKU;
                        } else if (product.productSKU) {
                            SKU = product.productSKU;
                        }
                        var productName = product.highlightName || product.name
                        productName = Handlebars.helpers.strong(productName);
                        var linkObj = {
                            'name': productName,
                            'SKU': SKU,
                            'friendlyUrl': product.friendlyUrl,
                            'openInNewWindow': product.openInNewWindow
                        };
                        var productJSON = _.escape(JSON.stringify(linkObj));
                    }
                    var content = '';
                    if (productName) {
                        content = _.unescape(productName);
                    }
                    if (options && options.hash['image'])
                        content = options.hash['image'];
                    if (options && options.hash['text']) {
                        content = _.escape(_.unescape(options.hash['text']));
                    }
                    return new Handlebars.SafeString("<a href=\"javascript:void(0);\" onClick=\"CCRZ.openPDP(this)\" class='" + styleClass + " gp_prod' data-product= '" + productJSON + "' data-id= '" + SKU + "'>" + content + "</a>")
                });
                Handlebars.registerHelper('missSpaces', function(string) {
                    if (string)
                        return string.replace(' ','');
                });
                Handlebars.registerHelper('sortCategories', function(categories, field) {
                    var result = _.sortBy(categories, function(e){
                        if (e.children){
                            e.children = _.sortBy(e.children, function(f){
                                return f[field];
                            });
                        }
                        return e[field];
                    });
                    return result;
                });
                //index offset helper
                Handlebars.registerHelper('offset', function(number, options) {
                    if(typeof(number) === 'undefined' || number === null)
                        return null;
                    return number + (options.hash.offset || 0);
                });
                //set image from static resources
                Handlebars.registerHelper('setImgSrc', function(str) {
                    var currSiteURL = CCRZ.pagevars.currSiteURL,
                        themeBaseURL = "",
                        themeBaseURLArray = CCRZ.pagevars.themeBaseURL.split("/");
                    for(var i = 0; i < themeBaseURLArray.length ; i++){
                        if(themeBaseURLArray[i] && themeBaseURLArray[i].toLowerCase() != CCRZ.pagevars.storefrontName.toLowerCase()){
                            themeBaseURL+=themeBaseURLArray[i]+"/";
                        }
                    }
                    return currSiteURL + themeBaseURL + str;
                });
                //overriden 'displayImage' helper
                Handlebars.registerHelper('displayImage', function(obj, styleClass, options) {
                    var blankImage = Handlebars.helpers.getReplacementImage();
                    var onerrorSrc = Handlebars.helpers.onerrorSrc();
                    if (options && options.hash['src']){
                        var imgSrc = _.escape(options.hash['src']);
                    }else{
                        var imgSrc = CCRZ.processImageURL(obj, styleClass, options);
                    }
                    if (imgSrc === ''){
                        imgSrc = '';
                    }
                    var alt = '';
                    if (options && options.hash['alt']){
                        alt = _.escape(options.hash['alt']);
                    }
                    var dataId = "";
                    if (options && options.hash['dataId']){
                        dataId = _.escape(options.hash['dataId']);
                    }
                    if (imgSrc.length > 0){
                        return new Handlebars.SafeString("<img class='" + styleClass +"' src='" + imgSrc + "' alt='" + alt + "' data-id='" + dataId + "' onerror='" + onerrorSrc + "'/>");
                    }else{
                        //return new Handlebars.SafeString("<img class='" + styleClass + " " + CCRZ.pagevars.userLocale + " noImg' alt='" + alt + "' data-id='" + dataId + "' onerror='" + onerrorSrc + "'/>");
                        return new Handlebars.SafeString("");
                    }
                });
                //return default product image src link
                Handlebars.registerHelper('getReplacementImage', function(){
                    var replacementImg = Handlebars.helpers.setImgSrc('images/img-not-available.svg');
                    return replacementImg;
                });
                //return onerror attr with replacement image
                Handlebars.registerHelper('onerrorSrc', function(){
                    return 'this.onerror=null;this.src="' + Handlebars.helpers.getReplacementImage() + '"';
                });
                //return link to Product Detail Page from SKU
                Handlebars.registerHelper('PDPLink', function(sku) {
                    return new Handlebars.SafeString(CCRZ.pagevars.currSiteURL + 'ccrz__ProductDetails?' + 'sku=' + sku + getCSRQueryString());
                });
                //return link to custom site form given pageKey
                Handlebars.registerHelper('goToCCPage_PageKey', function(pageKey) {
                    return new Handlebars.SafeString(CCRZ.pagevars.currSiteURL + 'ccrz__CCPage?pageKey=' + pageKey +  getCSRQueryString());
                });
                Handlebars.registerHelper('goToCategory', function(categoryId){
                    return new Handlebars.SafeString(CCRZ.pagevars.currSiteURL + 'ccrz__ProductList?viewState=ListView&cartId=' + CCRZ.pagevars.currentCartID + '&categoryId=' + categoryId + getCSRQueryString());
                });
                Handlebars.registerHelper('gridCalc', function(numOfSections) {
                    return 12/Math.floor(numOfSections);
                });
                Handlebars.registerHelper('groupProductsCarouselItems', function(num1, num2, place) {
                    if(num2==1){
                        return 'true';
                    }
                    else{
                        if (place=="begin" && (num1==0 || (num1!=1 && (num1+1)%(num2)==1))) return 'true';
                        else if (place=="end" && ((num1+1)%num2==0)) return 'true';
                    }
                });
                Handlebars.registerHelper('divideAndRoundUp', function(num1, num2) {
                    return Math.ceil(num1/num2);
                });
                Handlebars.registerHelper('loop', function(n, block) {
                    var accum = '';
                    for(var i = 0; i < n; ++i)
                        accum += block.fn(i);
                    return accum;
                });
                /*Handlebars.registerHelper('pageLabelMap', function(labelName) {
                    var params = Array.prototype.slice.call(arguments, 1);
                    var labelSymbol = "EL#";

                    var retLabel;
                    if (labelName) {
                        if (!CCRZ.pagevars.storeSettings.DisplayPageLabelNames__c && CCRZ.pagevars.pageLabels && !_.isUndefined(CCRZ.pagevars.pageLabels[labelName])) {
                            retLabel = CCRZ.pagevars.pageLabels[labelName];
                            if (_.isNull(retLabel)) {
                                retLabel = '';
                            } else if (!_.isUndefined(params) && params.length > 0) {
                                retLabel = new Handlebars.SafeString(substitute(retLabel, params));
                            } else {
                                retLabel = new Handlebars.SafeString(retLabel);
                            }
                        } else {
                            if (CCRZ.pagevars.storeSettings.DisplayPageLabelNames__c) {
                                retLabel = "[" + labelName + "]";
                            } else {
                                retLabel = labelName;
                            }
                        }
                    }
                    if (!retLabel) {
                        retLabel = '';
                    }
                    return retLabel;
                });*/
                Handlebars.registerHelper('pageLabelPrefixMap', function(prefix, labelName) {
                    return Handlebars.helpers.pageLabelMap(prefix+labelName);
                });
                Handlebars.registerHelper('ifCurrentTheme', function(themeValue) {
                    var theme = (CCRZ.pagevars.themeBaseURL).split('/');
                    return theme[theme.length-2] == themeValue;
                });
                Handlebars.registerHelper('textToHTML', function(str) {
                    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                });
                Handlebars.registerHelper('isCSRMode', function(options) {
                    if (CCRZ && CCRZ.pagevars && CCRZ.pagevars.portalUserId != ''){
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                });
                // Removing helper userName
                /*Handlebars.registerHelper('userName', function(options){
                    return r('user').get('user') ? r('user').get('user').FirstName : '';
                });*/
                Handlebars.registerHelper('getTaxesAmountFromJSON', function(cartData){
                    var taxesAmount = 0;
                    if(cartData){
                        var taxesJSON = cartData.cccustTaxesList;
                        if(taxesJSON){
                            var taxesList = JSON.parse($.parseHTML(taxesJSON)[0].data);
                            if(taxesList){
                                _.each(taxesList, function(tax){
                                    taxesAmount += tax['Amount'];
                                })
                            }
                        }
                    }
                    return taxesAmount;
                });
                Handlebars.registerHelper('getTaxesAmountFromJSONByDescription', function(cartData,desc){
                    var taxesAmount = 0;
                    if(cartData){
                        var taxesJSON = cartData.cccustTaxesList;
                        if(taxesJSON){
                            var taxesList = JSON.parse($.parseHTML(taxesJSON)[0].data);
                            if(taxesList){
                                _.each(taxesList, function(tax){
                                    if(desc == tax['TaxDescr']) taxesAmount += tax['Amount'];
                                })
                            }
                        }
                    }
                    return taxesAmount;
                });
                Handlebars.registerHelper('containsTaxesByDescription', function(cartData,desc){
                    if(cartData){
                        var taxesJSON = cartData.cccustTaxesList;
                        if(taxesJSON){
                            var taxesList = JSON.parse($.parseHTML(taxesJSON)[0].data);
                            if(taxesList){
                                return _.some(taxesList,function(tax){
                                     return desc == tax['TaxDescr']
                                 })
                            }
                        }
                    }
                    return false;
                });
                Handlebars.registerHelper('removeAfterSign', function(text, sign){
                    return text ? text.substr(0, text.indexOf(sign) + 1) : '';
                });
                Handlebars.registerHelper('checkoutStepNumber', function(index){
                    return index + 1;
                });
                Handlebars.registerHelper('equalsOrLower',  function(index, parentIndex, options){
                    if(index <= parentIndex) return options.fn(this);
                    return options.inverse(this);
                });
                Handlebars.registerHelper('getViewState', function(){
                    return CCRZ.getQueryParam('viewState');
                });
                Handlebars.registerHelper('normalizeShippingMethod', function(shipMethod){
                    return shipMethod.replace('null - ', '');
                });
                Handlebars.registerHelper('cartDiscountTotal', function(cartItems){
                    var totalDiscount = 0;
                    if(cartItems){
                        _.each(cartItems, function(item){
                            if(item.attributes && item.attributes.absoluteDiscount){
                                totalDiscount += item.attributes.absoluteDiscount;
                            }else if(item.absoluteDiscount){
                                totalDiscount += item.absoluteDiscount;
                            }
                        });
                    }
                    return totalDiscount;
                });
                Handlebars.registerHelper('getFooterLink', function(url) {
                    var sign = '?',
                        cartParam = '',
                        CSRQueryString = getCSRQueryString(),
                        containsQuestionMark = false,
                        storefront = CCRZ.pagevars.remoteContext.storefront;

                    if(url.indexOf('www') === 0 || url.indexOf('http') === 0 || url.indexOf('https') === 0) {
                       return url;
                    }
                    if(url.indexOf("?") >= 0) {
                        sign = '&';
                        containsQuestionMark = true;
                    }
                    if(CCRZ.pagevars.currentCartID != null){
                        cartParam = sign + 'cartId=' + CCRZ.pagevars.currentCartID;
                        containsQuestionMark = true;
                    }
                    if(containsQuestionMark == false && CSRQueryString.indexOf('&') == 0) {
                        CSRQueryString = CSRQueryString.replace('&', '?');
                    }
                   return url + cartParam + CSRQueryString;
                });
                Handlebars.registerHelper('getAbsoluteValue', function(number){
                    return Math.abs(number);
                });
                Handlebars.registerHelper('checkCouponInCartItems', function(cartItemList){
                    var isCouponInCart = null;
                    var coupon = 'Coupon';

                    isCouponInCart = _.find(cartItemList, function(element){
                        return element.cartItemType == coupon || element.productType == coupon;
                    });

                    return isCouponInCart ? true : false;
                });
                //Method to converDate from miliseconds to Date
                Handlebars.registerHelper('basePricingDate', function(selectedDate){
                    let d = new Date(selectedDate);
                    let endDate = d.toLocaleDateString();
                    return endDate;
                });

                Handlebars.registerHelper('phoneFormat', function(phoneNumber){
                    let phoneFormatted;
                    if(phoneNumber.length < 9){
                        phoneFormatted = phoneNumber.replace(/^(\d{3})(\d{3})(\d)+$/, "($1) $2-$3");
                    }else{
                        phoneFormatted = phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})+$/, "($1) $2-$3");
                    }
                    return phoneFormatted;
                });

                initialized = true;
            }
        }
    }
});