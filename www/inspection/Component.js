jQuery.sap.declare("sciener.mobile.inspection.Component");


sap.ui.core.UIComponent.extend("sciener.mobile.inspection.Component", {

});

sciener.mobile.inspection.Component.prototype.init = function() {
    var logonModel = sap.ui.getCore().getModel("logon");
    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
};

sciener.mobile.inspection.Component.prototype.createContent = function() {

    return new sap.m.Button({
        text: "Inspection"
    });
};
