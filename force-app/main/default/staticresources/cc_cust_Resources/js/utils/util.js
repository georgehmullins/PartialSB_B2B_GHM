/**
 *  Namespace for functions that can can be used in several views/namespaces
 *  @module util
 */
d('util', function() {
    return {
        /** IMPLEMENTATION OF VALIDATION WITH ERROR LABELS
        1.Input/textarea must be inside <div data-error="Error label"></div> section.
        2.Inputs/textareas must contain classes: req_field, 'inputClass' (own unique name), col-md-12.
        3.Email and phone are optional parameters. Their fields require <div class="col-md-12 incorrectEmail"></div> (or 'incorrectPhone') section below input.
        4.Add attribute disabled="disabled" to save button.
        5.Use functions for:
            ON EVENT (e.g. keyup) => validateFields
            OTHER (e.g. view refresh) => validateAndDisable
        */
        /**
        * Function that check if fields are proper or not empty and disable button until inputs are correct
          Email and phone fields are optional.
        */
        validateFields: function(e, view, inputClass, button, email, phone){
            validateEmptyFields(e, validateAndDisable(view, inputClass, button, email, phone));
        },
        /**
        * Function that check if fields are proper and disable button until inputs are correct
        Email and phone fields are optional.
        */
        validateAndDisable : function(view, inputClass, button, email, phone){
            validateAndDisable(view, inputClass, button, email, phone);
        },
        /**
        * Function that check if inputs are empty
        */
        validateEmptyFields : function(e, callback){
            validateEmptyFields (e, callback);
        },
        /**
        * Function that check if phone is valid
        */
        validatePhone : function(value) {
            return validatePhone(value);
        },
        /**
        * Function that check if email is valid
        */
        validateEmail : function(email){
            return validateEmail(email);
        },
        /**
        * Function that check if phone number from object is valid and show error label
        */
        validatePhoneFromObject : function(value, callback) {
            validatePhoneFromObject(value, callback);
        },
        /**
        * Function that check if email address from object is valid and show error label
        */
        validateEmailFromObject : function(email, callback){
            return validateEmailFromObject(email, callback);
        },
        /**
        * Function that check if email address from object is valid and show error label
        */
        validateDatepicker : function(date){
            return validateDatepicker(date);
        },
        /**
        * Function that remove readonly attribute for HTML tag
        */
        removeReadonly : function(date){
            return removeReadonly(date);
        },
        /**
        * Functions that shows and hides loading cover
        */
        loadingOn : function() {

        },
        loadingOff : function() {

        },
        /**
        * Function that finds dynamic view by its name
        */
        findDynamicView : function(viewName) {
            var dynamicView = _.findWhere(CCRZ.dynamicCustomView, { viewName : viewName });
            return dynamicView;
        },
        findCheckoutView : function(viewName) {
            var viewsArray = CCRZ.cartCheckoutView.subViewArray;

            var subView = _.filter(viewsArray, function(item){
                var view = item.view;
                if (view.viewName === viewName) {
                    return view;
                }
            }, viewName);

            return subView[0].view;
        },
        /**
        * Function that finds LLI Checkout subView by name
        */
        findLLIView : function(viewName) {
            var viewsArray = CCRZ.LLIcartCheckoutView.subViewArray;

            var subView = _.filter(viewsArray, function(item){
                var view = item.view;
                if (view.viewName === viewName) {
                    return view;
                }
            }, viewName);

            return subView[0].view;
        },
        rotateArrow: function(event){
            var icon = $(event.currentTarget).find(".icon-toggle i");
            var toggleableElement =  $(event.currentTarget).data("target");

            $(toggleableElement).on("hidden.bs.collapse", function(){
                icon.addClass('fa-caret-down').removeClass('fa-caret-up');
            });
            $(toggleableElement).on("shown.bs.collapse", function(){
                icon.removeClass('fa-caret-down').addClass('fa-caret-up');
            });
        },
        /**
        * Function that checks if value is integer or decimal number
        */
        validateDecimalAndIntegerField : function(event){
            var value = $(event.target).val();
            if(event.which < 45 || event.which > 58 || event.which == 47 ){
                return false;
            } // prevent if not number/dot
            if(event.which == 46 && value.indexOf('.') != -1){
                return false;
            } // prevent if already dot
            if(event.which == 45 && value.indexOf('-') != -1){
                return false;
            } // prevent if already dot
            if(event.which == 45 && value.length>0){
                event.preventDefault();
            } // prevent if already -
            return true;
        },
        checkIfFieldIsNotEmpty : function(input){
            var value = input.val().trim();
            return (value != "") ? true : false;
        },
        scrollToTop:function() {
           $('html, body').animate({
                 scrollTop: 0
           }, 500);
        },
        validateAllFields: function(inputClass, emailId, phoneId){
            var inputs = $("."+inputClass+"");
            var validate = true;
            _.each(inputs, function(e){
                var target = e.target === undefined ? $(e) : $(e.target);
                validateEmptyFields(e, function(result){
                     if(!result) { validate = false;}
                });
                if(emailId){
                    if(target.attr('id') == emailId){
                        validateEmailFromObject(target, function(result){
                            if(!result) { validate = false;}
                        });
                    }
                }
                if(phoneId){
                    if(target.attr('id') == phoneId){
                        validatePhoneFromObject(target, function(result){
                           if(!result) { validate = false;}
                        });
                    }
                }
            });
            return validate;
        },
        keepIfCollapsed: function (e, cookieName){
            var isCollapsed = $(e.currentTarget).find('.icon-toggle .fa').hasClass('fa-caret-up'),
                daysToExpire = 180;
            setCookie(cookieName, String(isCollapsed), daysToExpire);
        },
        collapseOnRender: function(view, cookieName){
            var isCollapsed = getCookie(cookieName),
                panelCollapse = view.$el.find('.panel-collapse'),
                iconCollapse = view.$el.find('.icon-toggle .fa');
            if (isCollapsed == "true"){
                panelCollapse.removeClass('in');
                iconCollapse.removeClass('fa-caret-up').addClass('fa-caret-down').attr('aria-expanded','false');
            }
        },
        convertStringToDate : function(dateToConvert){
            return convertStringToDate(dateToConvert);
        },
        formatDate : function(date,dateFormat){
            var year = date.getFullYear();
            var month = date.getMonth() + 1;

            if(month < 10){
                month = '0'+month;
            }
            var day = date.getDate();
            if(day < 10){
                day = '0'+day;
            }
            switch(dateFormat){
                case 'yyyy/mm/dd':
                    return year+'/'+month+'/'+day;
                case 'dd/mm/yyyy':
                    return day+'/'+month+'/'+year;
                default:
                    return month+'/'+day+'/'+year;
            }
        },
        isMobile : function(){
            var screensize = $(window).width();
            var maxDeviceWidth = 768; //max device width in px

            return (screensize < maxDeviceWidth) ? true : false;;
        },
        currViewState : function(){
            return CCRZ.getQueryParam('viewState');
        },
        clearInput : function(e){
            e.target.value = '';
        },
        setDefaultQty : function(e){
            if (e.target.value == '') e.target.value = 1;
        },
        loadOverlay : function(container) {
            $(container).prepend(createOverlay());
            if (!CCRZ.disableAdaptive) {
                $("#overlay").css({
                    width: $(window).width() / 2,
                    height: $(window).height() / 2,
                    top: $(window).height() / 4,
                    left: $(window).width() / 4
                });
                $(".circleContainer").css({
                    top: $(window).height() / 5,
                    left: $(window).width() / 5
                });
            }
            $("#overlay").show();
        },
        unloadOverlay : function() {
            $("#overlay").remove();
        },
        removeWhitespaceFromInput : function(e, fieldId) {
            if (e.target.value.indexOf(' ')>-1) {
                var fieldValue = document.querySelector(fieldId).value;
                document.querySelector(fieldId).value = fieldValue.replace(/ /g,'');
            }
        },
        isValidField :function(elementId){
            if($.trim($("#"+elementId).val()) ===''){
                return false;
            }else{
                return true;
            }
        }
    }

    function createOverlay(){
        if (!CCRZ.disableAdaptive) {
            if (Modernizr.mq('only all')) {
                return "<div id='overlay'><div class='circleContainer'><div class='circle'></div><div class='circle1'></div></div></div>";
            } else {
                return "<div id='overlay'><div class='circleContainer'><img src='" + CCRZ.pagevars.themeBaseURL + "images/loading.gif' alt='loading...' /></div></div>";
            }
        } else {
            return "<div id='overlay' class='modal-backdrop fade in'></div>";
        }
    }
    function validateEmptyFields (e, callback) {
        var target = e.target === undefined ? $(e) : $(e.target),
            idTarget = target.attr("id"),
            value = target.val().trim() || "",
            keyCode = e.keyCode || e.which,
            tabKeyCode = 9,
            spaceKeyCode = 32,
            result = false;
        if (value == "" && keyCode == spaceKeyCode){
            target.val("");
        }
        if (value == "" & keyCode != tabKeyCode) {
            if(target.parent().find('button').length !=1){
                target.attr("placeholder","");
                target.addClass("empty_input");
                target.closest('.form-group').find("label").addClass('empty_input_label');
                target.parent().addClass("errorContainer");
            }
            result = false;
        }
        else {
            target.removeClass("empty_input");
            target.closest('.form-group').find("label").removeClass('empty_input_label');
            target.parent().removeClass("errorContainer");
            result = true;
        }
        if(callback){
            callback(result);
        }
        return result;
    }

    function checkRequiredFields(view,inputClass){
        var v = view,
            reqFields = v.$el.find('.req_field').filter(inputClass),
            result = true;
        _.each(reqFields, function(e){
            if(e.value.trim() == ""){
                result=false;
            }
        });
        return result;
    }

    function validateAndDisable(view, inputClass, buttonClass, emailClass, phoneClass){
        var v = view;
        if (emailClass){
            var email = v.$el.find(emailClass);
        }
        if (phoneClass){
            var phone = v.$el.find(phoneClass);
        }
        if(buttonClass){
            if (checkRequiredFields(v,inputClass) && validateEmailFromObject(email) && validatePhoneFromObject(phone))
            {
                $(buttonClass).attr("disabled", false);
            }
            else
            {
                $(buttonClass).attr("disabled", true);
            }
        }
    }

     function validateEmail(email){
         var result = false,
            email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/i;
         if(email_regex.test(email)){
             result = true;
         }
         return result;
     }

      function validatePhone(phone){
          var isValidPhone = false,
              regex =  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
          var isValidPhone = phone.match(regex);
          return isValidPhone ? true : false;
      }

     function validateEmailFromObject(email, callback){
        var result = false;
        if(email){
            if(!_.isEmpty(email.val())){
                var emailAddress = email.val().trim();
                result = validateEmail(emailAddress);
            }
            else{
                result = false;
            }
        }
        else result = true;

        if(result == true){
            $(email).siblings('.incorrectEmail').hide();
            $(email).removeClass('error_input');
        }
        else{
            $(email).siblings('.incorrectEmail').show();
            $(email).addClass('error_input');
        }
        if(callback){
           callback(result);
        }
        return result;
     }

     function validatePhoneFromObject(phone, callback) {
         var result = false;
         if (phone){
             if(!_.isEmpty(phone.val())){
                 var phoneNumber = phone.val().trim();
                 result = validatePhone(phoneNumber);
             }
             else{
                 result = false;
             }
         }
         else result = true;

         if(result==true){
              $(phone).siblings('.incorrectPhone').hide();
              $(phone).removeClass('error_input');
         }
         else{
             $(phone).siblings('.incorrectPhone').show();
             $(phone).addClass('error_input');
         }
         if(callback){
             callback(result);
         }
         return result;
     }
     function convertStringToDate(dateToConvert){
        var dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
            dateSplit = dateToConvert.split('/');
        switch(dateFormat){
            case 'dd/mm/yyyy':
                var convertedDate = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
                return new Date(convertedDate);
            case 'yyyy/mm/dd':
                var convertedDate =  dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
                return new Date(convertedDate);
            default:
                return new Date(dateToConvert);
        }
     }

    function validateDatepicker(date) {
        var isValidDate = false,
            dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
            regex = getRegexForFormatDate(dateFormat),
            isValidDate = date.match(regex);
        if (isValidDate){
            var today = new Date(),
                requestedDate = convertStringToDate(date);
            return today < requestedDate;
        }
        return false;
    }
    function getRegexForFormatDate(dateFormat){
         switch(dateFormat){
             //date format: yyyy/mm/dd
             case 'yyyy/mm/dd':
                return /^(?:\d{4}\/(?:(?:(?:(?:0[13578]|1[02])\/(?:0[1-9]|[1-2][0-9]|3[01]))|(?:(?:0[469]|11)\/(?:0[1-9]|[1-2][0-9]|30))|(?:02\/(?:0[1-9]|1[0-9]|2[0-8]))))|(?:(?:\d{2}(?:0[48]|[2468][048]|[13579][26]))|(?:(?:[02468][048])|[13579][26])00)\/02\/29)$/;
             //date format: dd/mm/yyyy
             case 'dd/mm/yyyy':
                return /^(?:(?:(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2])|(?:29|30)\/(?:0[13-9]|1[0-2])|31\/(?:0[13578]|1[02]))\/[1-9]\d{3}|29\/02\/(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00))$/;
             //date format: mm/dd/yyyy
             default:
                return /^(((0?[1-9]|1[012])\/(0?[1-9]|1\d|2[0-8])|(0?[13456789]|1[012])\/(29|30)|(0?[13578]|1[02])\/31)\/(19|[2-9]\d)\d{2}|0?2\/29\/((19|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$/;
        }
     }

    function removeReadonly(e){
        $(e.target).removeAttr('readonly');
    }

     function setCookie(name, value, days) {
         var d = new Date;
         d.setTime(d.getTime() + 24*60*60*1000*days);
         document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
     }

     function getCookie(name) {
         var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
         return v ? v[2] : null;
     }
});