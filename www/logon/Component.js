/*global jQuery, sap, sciener*/

jQuery.sap.declare("sciener.mobile.logon.Component");
jQuery.sap.require("sciener.mobile.logon.util.Common");
jQuery.sap.require("sciener.mobile.logon.util.StorableJSONModel");
jQuery.sap.require("sap.ui.core.util.MockServer");


sap.ui.core.UIComponent.extend("sciener.mobile.logon.Component", {

});

sciener.mobile.logon.Component.prototype.init = function () {

    var rootPath = sciener.mobile.logon.util.Common.getRootPath(),
        i18nModel =  new sap.ui.model.resource.ResourceModel({
            bundleName: "sciener.mobile.logon.i18n.messageBundle"
        }),
        deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            deviceUUID: (window.device && window.device.uuid) ? window.device.uuid: 'undefined',
            deviceOS: (window.device && window.device.platform)? window.device.platform: 'undefined',
            defaultWidth:  sap.ui.Device.system.phone ? 22 : 22,
            smallWidth:  sap.ui.Device.system.phone ? 11 : 11,
            fieldUnit: "rem"
        });
        var
        authModel = new sciener.mobile.logon.util.StorableJSONModel(
            "logon-connection",
            [rootPath, "model/connection.json"].join("/")
        );
        var
        settingModel = new sciener.mobile.logon.util.StorableJSONModel(
            "logon-setting",
            [rootPath, "model/setting.json"].join("/")
        ),
        historyModel = new sciener.mobile.logon.util.StorableJSONModel(
            "logon-history",
            [rootPath, "model/history.json"].join("/")
        ),
        logonModel = new sap.ui.model.json.JSONModel();

    // регистрируем модели

   // sap.ui.getCore().setModel(deviceModel, "device");
   // sap.ui.getCore().setModel(authModel, "connection");
   // sap.ui.getCore().setModel(historyModel, "history");
   // sap.ui.getCore().setModel(settingModel, "setting");
   //// sap.ui.getCore().setModel(i18nModel, "i18n");
   // sap.ui.getCore().setModel(logonModel, "logon");


    this.setModel(i18nModel, "i18n");
    this.setModel(deviceModel, "device");
    this.setModel(historyModel, "history");
    this.setModel(settingModel, "setting");
    this.setModel(authModel, "connection");
    this.setModel(logonModel, "logon");

    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

};

sciener.mobile.logon.Component.prototype.createContent = function () {

    var viewLogon = sap.ui.view({
        height : "100%",
        width : "100%",
        id: "id-logon-view-logon",
        viewName: "sciener.mobile.logon.view.Logon",
        type: sap.ui.core.mvc.ViewType.JS
    }),
        viewSetting = sap.ui.view({
            height : "100%",
            width : "100%",
            id: "id-logon-view-setting",
            viewName: "sciener.mobile.logon.view.Setting",
            type: sap.ui.core.mvc.ViewType.JS
        });

    return new sap.m.NavContainer("id-logon-view-nav", {
        pages: [viewLogon, viewSetting],
        initialPage: viewLogon
    });
};

sciener.mobile.logon.Component.prototype.destroy = function () {
    sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
};