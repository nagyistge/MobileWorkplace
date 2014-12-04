/*global jQuery, sap, sciener*/
jQuery.sap.declare("sciener.mobile.logon.util.StorableJSONModel");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("jquery.sap.storage");

sap.ui.model.json.JSONModel.extend("sciener.mobile.logon.util.StorableJSONModel", {
    storageKey: "model",
    storage: null,
    storageId: undefined,

    constructor: function (sStorageId, sInitialFile) {
        //
        sap.ui.model.json.JSONModel.apply(this);
        this.storage = jQuery.sap.storage(jQuery.sap.storage.Type.local, this.storageKey);
        this.storageId = sStorageId;
        this.attachRequestCompleted(this.onRequestCompleted);
        if (this.hasEmptyStorage()) {
            if (sInitialFile) {
                this.loadData(sInitialFile);
            }
        } else {
            this.LoadFromStorage();
        }
    }
});


sciener.mobile.logon.util.StorableJSONModel.prototype.SaveToStorage = function () {
    this.storage.put(this.storageId, this.getJSON());
};


sciener.mobile.logon.util.StorableJSONModel.prototype.LoadFromStorage = function () {
    this.setJSON(this.storage.get(this.storageId));
};

sciener.mobile.logon.util.StorableJSONModel.prototype.hasEmptyStorage = function () {
    if (!this.storage.get(this.storageId)) {
        return true;
    }
    return false;
};

sciener.mobile.logon.util.StorableJSONModel.prototype.onRequestCompleted = function (oEvent) {
    oEvent.getSource().SaveToStorage();
};

sciener.mobile.logon.util.StorableJSONModel.prototype.loadData = function () {
    sap.ui.model.json.JSONModel.prototype.loadData.apply(this, arguments);
    this.SaveToStorage();
};


sciener.mobile.logon.util.StorableJSONModel.prototype.setData = function () {
    sap.ui.model.json.JSONModel.prototype.setData.apply(this, arguments);
    this.SaveToStorage();
};

sciener.mobile.logon.util.StorableJSONModel.prototype.setJSON = function () {
    sap.ui.model.json.JSONModel.prototype.setJSON.apply(this, arguments);
    this.SaveToStorage();
};

sciener.mobile.logon.util.StorableJSONModel.prototype.setProperty = function () {
    sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, arguments);
    this.SaveToStorage();
};





