/*global jQuery, sap, sciener*/

jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("sciener.mobile.logon.view.Setting", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf logon.view.Logon
     */
    onInit: function () {
        this.getView().setModel(sap.ui.getCore().getModel("setting"), "setting");
        this.eventBus = sap.ui.getCore().getEventBus();

    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf logon.view.Logon
     */
//  onBeforeRendering: function() {
//
//  },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf logon.view.Logon
     */
    onAfterRendering: function () {
        //console.log(sap.ui.getCore().getModel("setting"));

        //var view = this.getView(),
        //    inLogin = view.byId("id-logon-input-login"),
        //    logins = sciener.mobile.logon.util.History.getLogins();
        //
        //if (inLogin && logins && logins.length > 0) {
        //    inLogin.removeAllSuggestionItems();
        //    logins.forEach(function (element, index, array) {
        //        inLogin.addSuggestionItem(new sap.ui.core.Item({
        //            text: element
        //        }));
        //    });
        //}
    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf logon.view.Logon
     */
    onExit: function () {

    }

});