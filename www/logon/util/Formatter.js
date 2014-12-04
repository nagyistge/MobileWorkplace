/*global jQuery, sap, sciener*/
jQuery.sap.declare("sciener.mobile.logon.util.Formatter");
jQuery.sap.require("sciener.mobile.logon.util.Common");


sciener.mobile.logon.util.Formatter = {
    translate: function (source) {
        var i18nModel = sap.ui.getCore().getModel("i18n"),
            target = i18nModel.getResourceBundle().getText(source);
        if (target) {
            return target;
        }
        return source;
    },
    globalPath: function(localPath) {
    	return [sciener.mobile.logon.util.Common.getRootPath, localPath].join("/");
    }
};