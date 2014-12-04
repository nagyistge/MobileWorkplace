/*global jQuery, sap, sciener*/
jQuery.sap.declare("sciener.mobile.logon.util.ConnectionManager");
jQuery.sap.require("sciener.mobile.logon.util.Common");



sciener.mobile.logon.util.ConnectionManager = {
    _connectionModel: null,
    _connectionModelData: null,
    _transactionStarted: false,

    getConnectionManager: function (oConnectionModel) {
        var
            json;
        this._connectionModel = oConnectionModel;
        json = this._connectionModel.getJSON();
        if (window.JSON && window.JSON.parse) {
            this._connectionModelData = JSON.parse(json);
        } else {
            throw new Error("JSON not support");
        }
        return this;
    },

    getApplications: function () {
        return this._connectionModelData.MobileApplications;
    },

    getApplicationById: function (sApplicationId) {

        return this._getById(this.getApplications(), "ApplicationID", sApplicationId);
    },

    updateApplicationInfo: function (oApplication) {
        var app = this.getApplicationById(oApplication.ApplicationID);
        app.ModelURI = oApplication.ModelURI || app.ModelURI;
        app.Version = oApplication.Version || app.Version;
        //this._updateModel();
    },


    getUsers: function () {
        return this._connectionModelData.MobileUsers;
    },

    getUserByLoginAndPassword: function (sUserID, sPassword) {
        var hashPassword = this.createHash(sPassword),
            users = this.getUsers(),
            i;

        if (!users || users.length === 0) {
            return null;
        }
        for (i = 0; i < users.length; i++) {
            if (users[i].UserID === sUserID &&
                users[i].Password === hashPassword) {
                return users[i];
            }
        }
    },

    getUserById: function (sUserID) {
        return this._getById(this.getUsers(), "UserID", sUserID);
    },

    addUser: function (oUser, sPassword) {
        var user;
        // недостаточно информации для добавления пользователя
        if (!(oUser && oUser.UserID && sPassword)) {
            return false;
        }
        // Пользователь уже имеется
        if (this.getUserByLoginAndPassword(oUser.UserID, sPassword)){
            return true;
        }
        // Но с другим паролем, TODO Продумать обновление пользователя в таком случаее
        user = this.getUserById(oUser.UserID);
        if (user) {
            this.deleteUser(user);
            //this._updateModel();
        }

        // Добавляем пользователя
        user = {};
        user.Password = this.createHash(sPassword);
        user.UserID = oUser.UserID;
        user.Name = oUser.Name;
        user.Timezone = oUser.Timezone;
        user.Lang = oUser.Lang;
        this.getUsers().push(user);
        //this._updateModel();
        return true;
    },

    updateUser: function (oUser, sPassword) {
        this.deleteUser(oUser, sPassword);
        this.addUser(oUser, sPassword);
    },

    deleteUser: function (oUser, sPassword) {
        var hashPassword,
            users = this.getUsers(),
            i;

        if (sPassword) {
            hashPassword = this.createHash(sPassword);
        } else {
            hashPassword = oUser.Password;
        }

        if (!hashPassword) {
            return false;
        }

        if (!users || users.length === 0) {
            return true;
        }
        for (i = 0; i < users.length; i++) {
            if (users[i].UserID === oUser.UserID &&
                    users[i].Password === hashPassword) {
                users.splice(i, 1);
               // this._updateModel();
                return true;
            }
        }
        return false;
    },

    getConnections: function () {
        return this._connectionModelData.Connections;
    },

    deleteConnection: function (oConnection) {
        var conn = this.getConnections(),
            i;

        if (this.getConnectionById(oConnection.ConnectionID)){
            for (i = 0; i < conn.length; i++) {
                if (conn[i].ConnectionID === oConnection.ConnectionID) {
                    conn.splice(i, 1);
                  //  this._updateModel();
                    return true;
                }
            }
        }
        return false;
    },

    getConnectionById: function (sConnctionId) {
        return this._getById(this.getConnections(), "ConnectionID", sConnctionId);
    },

    getConnectionByUserIdAndApplicationId: function (sUserID, sApplicationID) {
        var connection = this.getConnections(),
            i;

        if (!connection || connection.length === 0) {
            return null;
        }
        for (i = 0; i < connection.length; i++) {
            if (connection[i].ApplicationID === sApplicationID &&
                    connection[i].UserID === sUserID) {
                return connection[i];
            }
        }
    },

    addConnection: function (oConnection) {
        var connectionID = (oConnection && oConnection.ConnectionID),
            connections = this.getConnections(),
            connection = {};

        if (!connectionID) {
            return false;
        }

        if (!this.getConnectionById(connectionID)) {
            connection.ConnectionID = oConnection.ConnectionID ;
            connection.ApplicationID = oConnection.ApplicationID;
            connection.UserID = oConnection.UserID;
            connection.DeviceType = oConnection.DeviceType;
            connection.DeviceUUID = oConnection.DeviceUUID;
            connections.push(connection);
            return true;
        }
    },

    transactionStarted: function () {
        return this._transactionStarted;
    },

    startTransaction: function() {
        this._transactionStarted = true;
        this.getConnectionManager(this._connectionModel)
    },

    commit: function () {
        if (this._transactionStarted) {
            this._transactionStarted = false;
            this._updateModel();
            this._connectionModel.updateBindings();
        }
    },
    rollback: function () {
        if (this._transactionStarted) {
            this._transactionStarted = false;
            this.getConnectionManager(this._connectionModel);
        }
    },

    _updateModel: function () {
        this._connectionModel.setData(this._connectionModelData);
    },

    _getById: function (oArray, fieldId, sIs) {
        var i;
        if (!(oArray && oArray.length > 0)) {
            return null;
        }
        for (i = 0; i < oArray.length; i++) {
            if (oArray[i][fieldId] === sIs) {
                return oArray[i];
            }
        }
    }

};

jQuery.getScript([sciener.mobile.logon.util.Common.getRootPath(), "thirdparty/sha1.js"].join("/"), function (data, textStatus, jqxhr) {
    if (jqxhr.status === 200) {
        sciener.mobile.logon.util.ConnectionManager.createHash = function (sSource) {
            return window.CryptoJS.SHA1(sSource).toString();
        };
    } else {
        sciener.mobile.logon.util.ConnectionManager.createHash = function (sSource) {
            return sSource;
        };
    }

});

