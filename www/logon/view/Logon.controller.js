/*global jQuery, sap, sciener*/

jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sciener.mobile.logon.util.SignInModelSingleton");
jQuery.sap.require("sciener.mobile.logon.util.ConnectionManager");
jQuery.sap.require("sciener.mobile.logon.util.HistoryManager");



sap.ui.controller("sciener.mobile.logon.view.Logon", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf logon.view.Logon
*/
    onInit: function () {
        //this.getView().setModel(sap.ui.getCore().getModel("connection"), "connection");
        //this.getView().setModel(sap.ui.getCore().getModel("i18n"), "i18n");
        //this.getView().setModel(sap.ui.getCore().getModel("device"), "device");
        //this.getView().setModel(sap.ui.getCore().getModel("setting"), "setting");
        //this.getView().setModel(sap.ui.getCore().getModel("history"), "history");
        //this.eventBus = sap.ui.getCore().getEventBus();

    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf logon.view.Logon
*/
    onBeforeRendering: function () {

    },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf logon.view.Logon
*/
    onAfterRendering: function () {

    },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf logon.view.Logon
*/
    onExit: function () {

    },

    // Пользовательские методы
    onLiveChange: function (oEvent) {
        var source = oEvent.getSource();
        source.setValueState(sap.ui.core.ValueState.None);
    },

    onPressSettings: function (oEvent, oData) {
        var nav = sap.ui.getCore().byId("id-logon-view-nav");
        nav.to("id-logon-view-setting");
    },

    onPressSignIn: function (oEvent, oData) {
        var inLogin = oData.login,
            inPassword = oData.password,
            slApplication = oData.application,
            login = inLogin.getValue(),
            password = inPassword.getValue(),
            application = slApplication.getSelectedItem().getKey();

        login = login.toUpperCase();
        application = application.toLocaleUpperCase();

        inPassword.setValue("");
        // проверяем заполнение регистрационныйх данных
        if (!login) {
            inLogin.setValueState(sap.ui.core.ValueState.Error);
        }

        if (!password) {
            inPassword.setValueState(sap.ui.core.ValueState.Error);
        }
        // входим в приложение
        if (login && password && application) {
            this.loginToApp(login, password, application);
        }
    },

    loginToApp: function (sLogin, sPassword, sApplication) {
        this.connectionManager = sciener.mobile.logon.util.ConnectionManager.getConnectionManager(
            this.getView().getModel("connection")
        );
        this.historyManger = sciener.mobile.logon.util.HistoryManager.getHistoryManager(
            this.getView().getModel("history")
        );
        var dataModel,
            pathAssignPathToUser = "/AssignUserToAppSet(UserID='" +
                sLogin + "',ApplicationID='" + sApplication + "')";

        try {
            this.connectionManager.startTransaction();
            dataModel = sciener.mobile.logon.util.SignInModelSingleton.getInstance(sLogin, sPassword);
            dataModel.read(
                pathAssignPathToUser,
                {
                    urlParameters: {$expand: "MobileUser,MobileApplication,ConnectionSet"},
                    success: this.successLogin.bind(this, sLogin, sPassword, sApplication),
                    error: this.errorLogin.bind(this, sLogin, sPassword, sApplication)
                }
            );
        } catch (error) {
            this.handleError("Internal Error",  error.message)
        }
    },
    successLogin: function (sLogin, sPassword, sApplication, oData, oResponse) {
        var    deviceModel = this.getView().getModel("device"),
            dataModel = sciener.mobile.logon.util.SignInModelSingleton.getInstance(sLogin, sPassword),
            clientConnection = this.connectionManager.getConnectionByUserIdAndApplicationId(sApplication, sLogin),
            clientUser = this.connectionManager.getUserByLoginAndPassword(sLogin, sPassword),
            clientApplication = this.connectionManager.getApplicationById(sApplication),
            serverConnection = oData.ConnectionSet.results[0],// TODO Пока считаем, что может быть зарегистрировано только 1 соединение
            serverUser = oData.MobileUser,
            serverApplication = oData.MobileApplication,
            needNewConnection = false,
            currentUser,
            currentApplication,
            currentConnection;

        // Обновляем информациюю о пользователе
        if (!clientUser) {
            if (!this.connectionManager.addUser(serverUser, sPassword)) {
                this.handleError("Internal Error",  "Could not add a user");
                return;
            }
        } else {
            this.connectionManager.updateUser(serverUser, sPassword);
        }
        // Устанавливаем текущего пользователя
        currentUser = jQuery.extend({}, this.connectionManager.getUserByLoginAndPassword(sLogin, sPassword));
        currentUser.Password = sPassword;

        this.historyManger.startTransaction(); // Обновляем историю вводимых логинов
        this.historyManger.addLogin(sLogin);
        this.historyManger.commit();

        // Обновляем информаию о приложении
        if (clientApplication.Version !== serverApplication.Version) {
            this.connectionManager.updateApplicationInfo(serverApplication);
        }
        // Устанавливаем текущее приложение
        currentApplication = jQuery.extend({}, this.connectionManager.getApplicationById(sApplication));

        // Проверяем есть ли соединение
        if (clientConnection && serverConnection) {
            if (clientConnection.ConnectionID === serverConnection.ConnectionID) {
                // Повторное соединенние не требуется
                currentConnection = jQuery.extend({}, clientConnection);
                needNewConnection = false;
            } else {
                // Зарегистировано другое устройство
                this.connectionManager.deleteConnection(clientConnection);
                this.handleError("Connection Error", "Other devices connected with this application");
                return;
            }
        } else if (!clientConnection && serverConnection) {
            this.handleError("Connection Error", "Other devices connected with this application");
            return;
        } else if (clientConnection && !serverConnection) {
            this.connectionManager.deleteConnection(clientConnection);
            needNewConnection = true;
        } else {
            needNewConnection = true;
        }

        if (needNewConnection) {
            //регистрируем новое соединение
            dataModel.create("/ConnectionSet", {
                ApplicationID: sApplication,
                UserID: sLogin,
                DeviceType: deviceModel.getProperty("/deviceOS"),
                DeviceUUID: deviceModel.getProperty("/deviceUUID")
            }, {
                success: this.successCreateConnection.bind(this, currentUser, currentApplication),
                error: this.errorCrateConnection.bind(this)
            });
        } else {
            this.navToApplication(currentUser, currentApplication, currentConnection);
        }
    },

    errorLogin: function (sLogin, sPassword, sApplication, oError) {
        var clientConnection = this.connectionManager.getConnectionByUserIdAndApplicationId(sLogin, sApplication),
            clientUser = this.connectionManager.getUserByLoginAndPassword(sLogin, sPassword),
            clientApplication = this.connectionManager.getApplicationById(sApplication);
        console.log(oError, this);
        switch (oError.response.statusCode) {
        // Аутентификация не удалась
        case 401:
            this.handleError("Authentication error", "Incorrect username or password");
            break;
            // Ауторизация не удалась (пользователю не присвоено мобильных приложений)
        case 404:
            this.handleError(
                "Authorization error",
                ["Application ", sApplication, " not alloved for user ", sLogin ].join(" ")
            );
            break;
        // Запрос не выполнен, используем локальную информацию
        default:
            if (clientConnection && clientUser && clientApplication) {
                this.navToApplication(
                    jQuery.extend({}, clientUser),
                    jQuery.extend({}, clientApplication),
                    jQuery.extend({}, clientConnection)
                );
            } else {
                this.handleError("Connection Error", "Failed to create a connection for an application");
            }
        }
    },

    successCreateConnection: function (currentUser, currentApplication, oData, response) {
        var currentConnection;
        console.log(oData, response, this);
        if (this.connectionManager.addConnection(oData)) {
            currentConnection = jQuery.extend({}, this.connectionManager.getConnectionById(oData.ConnectionID));
            this.connectionManager.commit();
            this.navToApplication(currentUser, currentApplication, currentConnection);
        } else {
            this.handleError("Internal Error", "Could not add a connection");
        }
    },

    errorCrateConnection: function (oError) {
        this.handleError("Connection Error", "Failed to create a connection for an application");
    },

    handleError: function(sCaption, sText){
        this.connectionManager.rollback();
        sap.m.MessageBox.show(
            sText,
            sap.m.MessageBox.Icon.ERROR,
            sCaption
        );
    },

    navToApplication: function (currentUser, currentApplication, currentConnection) {
        var logonModel = sap.ui.getCore().getModel("logon"),
            logonData = {
                Application: currentApplication,
                User: currentUser,
                Connection: currentConnection
            };

        if (!logonModel) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(logonData), "logon");
        } else {
            logonModel.setData(logonData);
        }
        this.eventBus.publish("main", "changeApp", logonModel );
    }
});