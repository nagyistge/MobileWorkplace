/*global jQuery, sap, sciener*/
jQuery.sap.declare("sciener.mobile.logon.util.HistoryManager");

sciener.mobile.logon.util.HistoryManager = {
    _historyModel: null,
    _historyModelData: null,
    _transactionStarted:  false,

    getHistoryManager: function (oHistoryModel) {
        var
            json;

        this._historyModel = oHistoryModel;
        json = this._historyModel.getJSON();
        if (window.JSON && window.JSON.parse) {
            this._historyModelData = JSON.parse(json);
        } else {
            throw new Error("JSON not support");
        }
        return this;
    },

    getUsers: function () {
        return this._historyModelData.Users;
    },

    addLogin: function (sLogin) {
        var users = this.getUsers(),
            user = {},
            i;
        for (i = 0; i < users.length; i++) {
            if (users[i].UserID === sLogin) {
                return;
            }
        }
        user.UserID = sLogin;
        users.push(user);
    },

    getEvants: function () {
        return this._historyModelData.Events;
    },

    addEvent: function (oEvent) {
        this.getEvants().push(oEvent);
    },

    _updateModel: function () {
        this._historyModel.setData(this._historyModelData);
        this._historyModel.updateBindings();
    },


    transactionStarted: function () {
        return this._transactionStarted;
    },

    startTransaction: function() {
        this._transactionStarted = true;
        this.getHistoryManager(this._historyModel)
    },

    commit: function () {
        if (this._transactionStarted) {
            this._transactionStarted = false;
            this._updateModel();
            this._historyModel.updateBindings();
        }
    },
    rollback: function () {
        if (this._transactionStarted) {
            this._transactionStarted = false;
            this.getHistoryManager(this._historyModel);
        }
    },
};