/*global jQuery, sap, sciener*/
jQuery.sap.require("sciener.mobile.logon.util.Formatter");
jQuery.sap.require("sciener.mobile.logon.util.Common");

sap.ui.jsview("sciener.mobile.logon.view.Logon", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf sciener.mobile.logon.view.Logon
	*/ 
	getControllerName : function () {
		return "sciener.mobile.logon.view.Logon";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf sciener.mobile.logon.view.Logon
	*/ 
	createContent : function (oController) {
		var fieldWidth = "{device>/defaultWidth}{device>/fieldUnit}",
		    buttonWidth = "{device>/smallWidth}{device>/fieldUnit}",
		    settingModel = this.getModel("setting"),
			inLogin = new sap.m.Input(this.createId("id-logon-input-login"), {
	        	width: fieldWidth,
	        	maxLength: 12,
	        	minLength: 6,
	        	placeholder: "{i18n>LOGIN_PLACEHOLDER}",
	        	valueStateText: "{i18n>LOGIN_STATE_TEXT}",
	        	valueLiveUpdate: true,
				showSuggestion: true,
				suggestionItems: {
					path: "history>/Users",
					template: new sap.ui.core.Item({
						text: "{history>UserID}"
					})
				},
	        	liveChange: [oController.onLiveChange, oController]
	        }),
			inPassword = new sap.m.Input(this.createId("id-logon-input-password"), {
	        	width: fieldWidth,
	        	minLength: 6,
	        	placeholder: "{i18n>PASSWORD_PLACEHOLDER}",
	        	valueStateText: "{i18n>PASSWORD_STATE_TEXT}",
	        	type: sap.m.InputType.Password,
	        	valueLiveUpdate: true,
	        	liveChange: [oController.onLiveChange, oController]
	        }),
	        lbLogin =  new sap.m.Label(this.createId("id-logon-label-login"), {
	        	width: fieldWidth,
	        	text: "{i18n>LOGIN_LABEL}",
	        	//required: true,
	        	labelFor: inLogin
	        }),
	        lbPassword = new sap.m.Label(this.createId("id-logon-label-password"), {
	        	width: fieldWidth,
	        	text: "{i18n>PASSWORD_LABEL}",
	        	labelFor: inPassword
	        }),
	        itComponent = new sap.ui.core.Item({
	        	key: "{connection>ApplicationID}",
	        	text: {
					path: "connection>Description",
					type: new sap.ui.model.type.String(),
					formatter: sciener.mobile.logon.util.Formatter.translate
				}//localeAppDescr,
	        }),
	        slComponent = new sap.m.Select("id-logon-select-application", {
	        	width: fieldWidth,
	        	items:{
	        		path: "connection>/MobileApplications",
	        		template: itComponent
	        	}
	        }),
	        lbComponent = new sap.m.Label(this.createId("id-logon-label-application"), {
	        	width: fieldWidth,
	        	text: "{i18n>APPLICATION_LABEL}",
	        	labelFor: slComponent
	        }),
	        bnSignIn =  new sap.m.Button(this.createId("id-logon-button-signin"), {
	        	width: buttonWidth,
	        	text: "{i18n>SIGN_IN_BUTTON_TEXT}",
	            type: sap.m.ButtonType.Emphasized,
	            press: [{login: inLogin, password: inPassword, application: slComponent },
	                    oController.onPressSignIn, oController]
	        }),
	        imgLogo =  new sap.m.Image({
				//src: [sciener.mobile.logon.util.Common.getRootPath(), settingModel.getProperty("/Logo")].join("/"),
				alt: "{i18n>LOGO_ALT_TEXT}"
			}),
			flexBtnRow = new sap.m.FlexBox(this.createId("id-logon-flex-button"), {
				width : fieldWidth,
			    direction: sap.m.FlexDirection.Row,
			    justifyContent : sap.m.FlexJustifyContent.Start,
			    alignItems: sap.m.FlexAlignItems.Start,
				items:[ bnSignIn ]
			}), 
			flexColumn = new sap.m.FlexBox(this.createId("id-logon-flex-column"), {
			   direction: sap.m.FlexDirection.Column,
			   justifyContent : sap.m.FlexJustifyContent.Center,
			   alignItems: sap.m.FlexAlignItems.Center,
			   items:[ 

			            lbLogin,
				        inLogin,
				        lbPassword,
				        inPassword,
				        lbComponent,
				        slComponent,
				        flexBtnRow
				     ]
			}),
			txLogon =  new sap.m.Text({
				textAlign: sap.ui.core.TextAlign.Center,
				text: "{i18n>SIGN_IN_FORM_HEADER}"
			}),
			tbLogon = new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto , 
				content:[txLogon]
			}),
			panelLogon = sap.m.Panel({
				content: flexColumn,
				//design: sap.m.ToolbarDesign.Transparent,
				infoToolbar : tbLogon
			}),
			flexRow = new sap.m.FlexBox(this.createId("id-logon-flex-row"), {
			    fitContainer: true,
			    direction: sap.m.FlexDirection.Row,
			    justifyContent : sap.m.FlexJustifyContent.Center,
			    alignItems: sap.m.FlexAlignItems.Center,
				items:[ panelLogon ]
			}),
			pLogin =  new sap.m.Page(this.createId("id-logon-page-main"), {
				//title: "Welcome to Mobile Inspection",
				enableScrolling: false,
				showFooter: true,
				content: [
						 flexRow
				],
				customHeader: new sap.m.Bar({
					contentRight: new sap.m.Button({
						icon: "sap-icon://settings",
						press: [oController.onPressSettings, oController]
					}),
					contentMiddle: new sap.m.Label({
						text: "{i18n>MAIN_HEADER}",
						design: sap.m.LabelDesign.Bold
					})
				}),
				footer: new sap.m.Bar({
					contentLeft: imgLogo
			    })
		    });

		jQuery.sap.includeStyleSheet(
			[jQuery.sap.getModulePath("sciener.mobile.logon"),"css/custom.css"].join("/"),
			"sciener-ui-theme-m.logon");

			txLogon.addStyleClass("scienerMText");    
 		// handler for Enter key press
 		pLogin.attachBrowserEvent("keypress", function(event) {
 			if (event.keyCode == 13) {
 				bnSignIn.firePress();
 			}
 			
 		});
        this.addEventDelegate({
            onBeforeShow: function(evt) {
                 console.log(evt);
            }
        });
 		return pLogin;
	}

});