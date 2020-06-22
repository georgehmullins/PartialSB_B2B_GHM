d("registerPageView", ['ccrz','util'], function(CCRZ, UTIL) {

    CCRZ.views.cc_cust_RegisterPageView = CCRZ.CloudCrazeView.extend({
        el : CCRZ.uiProperties.registerPageView.el,
        viewName : 'cc_cust_RegisterPageView',
        templateDesktop: CCRZ.util.template(CCRZ.uiProperties.registerPageView.tmpl),
        init: function(){
            let v = this;
            v.render();
            CCRZ.subsc = _.extend(CCRZ.subsc||{});
            CCRZ.subsc.RemoteAjax =  _.extend(CCRZ.RemoteInvocation,{
				className : 'B2B_UserRegistrationController',
				verifyEmail : function(reqData){
					
					this.invokeCtx('verifyEmail',
									reqData, 
									function(resp, evt){
										if(evt.status){
											if(resp && resp.success){//response was successful
												
												
												if(resp.data.isExisting){
													CCRZ.pubSub.trigger('pageMessage',
                                                    {
                                                        messages:[
                                                            {
                                                                type : 'CUSTOM',
                                                                severity : 'SUCCESS',
                                                                message : 'Existing contact found. Please contact customer support.',
                                                                classToAppend : 'messaging_block'
                                                            }
                                                        ]
                                                    });
												}else{
													$('#CheckForExistingUser').hide();
                                                    $('#newLead').show();
                                                    $('#email').val($('#existingemail').val());
                                                    $('#existingemail').val('')
												} 
											}else{
												
											}
										}else{
											//handle standard RemoteAction failure here
										}
									},
									{
										buffer:false, //this call will be executed by itself
										nmsp : false //defines that this is a call to a subscriber class
									}
								);//end invokeCtx call
				}
			});
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderPhone : function() {
            this.renderView(this.templatePhone);
        },
        renderView: function(currTemplate) {
            this.$el.html(currTemplate());
        },
        events: {
            "click .checkExistingUser": "validateEmail"
        },
        validateEmail : function(){
            let email = $.trim($('#existingemail').val());
            if(UTIL.validateEmail(email)){
                $('#errormessage').html('');
                CCRZ.subsc.RemoteAjax.verifyEmail(JSON.stringify({email:email}));
            }else{
                $('#errormessage').html('Please fill required valid email');
            }    
        }
        
    });
    return CCRZ.views.cc_cust_RegisterPageView;
    
});