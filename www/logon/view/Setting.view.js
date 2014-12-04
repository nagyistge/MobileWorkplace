/*global jQuery, sap, sciener*/
jQuery.sap.require("sciener.mobile.logon.util.Formatter");

sap.ui.jsview("sciener.mobile.logon.view.Setting", {

    /** Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf sciener.mobile.logon.view.Logon
     */
    getControllerName : function () {
        return "sciener.mobile.logon.view.Setting";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf sciener.mobile.logon.view.Logon
     */
    createContent : function(oController) {
        return new sap.m.Button("id_back", {
            text: "Back",
            press: function(){
                var nav = sap.ui.getCore().byId("id-logon-view-nav");
                nav.to("id-logon-view-logon");
        }
        })
    }

});