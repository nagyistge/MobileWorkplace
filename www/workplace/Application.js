jQuery.sap.declare("sciener.mobile.workplace.Application");

sciener.mobile.workplace.Application = {
    Environment: {
        Web: "Web",
        Cordova: "Cordova"
    },
    configMap: {},
    componentsMap: {},

    config: function(oConfig){
        var i;
        if (oConfig["environment"]){
            this.configMap["environment"] = oConfig["environment"];
        } else {
            // TODO Add exception
        }

        if( oConfig["initialComponent"]){
            this.configMap["initialComponent"] = oConfig["initialComponent"];
        } else {
            // TODO Add exception
        }

        if( oConfig["logonModel"]){
            this.configMap["logonModel"] = oConfig["logonModel"];
        } else {
            // TODO Add exception
        }

        if( oConfig["components"] &&  oConfig["components"].length && oConfig["components"].length > 0){
            for(i = 0; i < oConfig["components"].length; i++){
                this.componentsMap[oConfig["components"][i]] = undefined;
            }

        } else {
            // TODO Add exception
        }

    },

    init: function(){
        this.componentsMap = {};
        this.shell = new sap.m.Shell();
        this.eventBus = sap.ui.getCore().getEventBus();
        sap.ui.getCore().setModel(this.componentsMap.logonModel, "logon");
        this.eventBus.subscribe("main", "setComponent", jQuery.proxy(this.onSetComponent,this));

        switch (this.configMap["environment"]){
            case this.Environment.Web:
                this.initWeb();
                break;
            case this.Environment.Cordova:
                this.initCordova();
                break;
            default:
                break;
        }
    },

    initWeb: function(sEnvironment){
        sap.ui.getCore().attachInit(jQuery.proxy(this.onInit,this));
    },

    initCordova: function(){
        // обработчики основных событий Cordova
        document.addEventListener('deviceready', jQuery.proxy(this.onDeviceReady,this), false);
        document.addEventListener('pause', jQuery.proxy(this.onDevicePause,this), false);
        document.addEventListener('resume', jQuery.proxy(this.onDeviceResume,this), false);
        document.addEventListener('backbutton', jQuery.proxy(this.onDeviceBackButton,this), false);
    },

    onInit: function(){
        this.eventBus.publish("main", "setComponent", this.configMap.initialComponent);
        this.shell.placeAt("content");
    },

    onDeviceReady: function() {
        this.onInit();
        this.eventBus.publish("device", "ready");
    },

    onDevicePause: function(){
        this.eventBus.publish("main", "setComponent", this.configMap.initialComponent);
        this.eventBus.publish("device", "pause");
    },

    onDeviceResume: function() {
        this.eventBus.publish("device", "resume");
    },

    onDeviceBackButton: function() {
        this.eventBus.publish("device", "backbutton");
    },

    onSetComponent: function(sChannel, sEvent, oData){
        this.setComponent(oData);
    },

    setComponent: function(sComponentName) {
        if(!this.componentsMap[sComponentName]){
            this.componentsMap[sComponentName] = new sap.ui.core.ComponentContainer({
                    height : "100%",
                    name : sComponentName
            })
        }

        this.shell.setApp(this.componentsMap[sComponentName]);
    }

};