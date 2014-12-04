/*global jQuery, sap, sciener*/

jQuery.sap.declare("sciener.mobile.logon.util.SignInModelSingleton");
jQuery.sap.require("sap.ui.core.util.MockServer");
jQuery.sap.require("sciener.mobile.logon.util.Common");

sciener.mobile.logon.util.SignInModelSingleton = {

    getInstance: function (sLogin, sPassword) {
        var model,
            mockServer;
        return (function (login, password) {
            var setting = sap.ui.getCore().getModel("setting"),
                modelUrl = setting.getProperty("/isFake") ? setting.getProperty("/FakeUrl") : setting.getProperty("/RealUrl"),
                rootPath = sciener.mobile.logon.util.Common.getRootPath();

            if (model) {
                return model;
            }

            // Для тестирования используем MockServer
            if (setting.getProperty("/isFake")) {
                mockServer = new sap.ui.core.util.MockServer({
                    rootUri: setting.getProperty("/FakeUrl")
                });
                mockServer.simulate([rootPath, "model/mock/edmx.xml"].join("/"), {
                    sMockdataBaseUrl: [rootPath, "model/mock/"].join("/"),
                    bGenerateMissingMockData: true
                });
                mockServer.start();
            }
            model = new sap.ui.model.odata.ODataModel(
                modelUrl,
                true,
                login,
                password
            );
            return model;
        }(sLogin, sPassword));
    }
};