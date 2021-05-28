sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "../BaseController",
    "ui5-demo/model/DataService",
    "computed-properties-lib/ComputedPropertyBuilder"
], function (
    JSONModel,
    BaseController,
    DataService,
    ComputedPropertyBuilder
) {
    "use strict";

    return BaseController.extend("ui5-demo.view.table.Table", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);

            this.setModel(new JSONModel({
                count: 0,
                wrappedData: [
                    {obj: {}, temp: {prettyEmail: "", editMode: false, email: ""}}
                ]
            }), "local");

            DataService.loadData()
                .then(function (data) { this.setModel(new JSONModel(data)) }.bind(this));

            this.addComputedProperties();
        },

        addComputedProperties: function () {
            // count
            new ComputedPropertyBuilder(this, "local>/count")
                .withFuncExpressionBinding(function (data) { return data.length; }, ["/data"])
                .add();

            // wrappedData
            var tempMap = this.createTempMap();
            var wrappingFunction = function (list) {
                return list.map(function (it) {
                    return {
                        obj: it,
                        temp: tempMap.getOrCreate(it.login)
                    };
                });
            }

            new ComputedPropertyBuilder(this, "local>/wrappedData")
                .withFuncExpressionBinding(wrappingFunction, ["/data"])
                .add();

            // prettyEmail
            new ComputedPropertyBuilder(this, "local>temp/prettyEmail")
                .withFuncExpressionBinding(
                    function (vorname, nachname, email) { return vorname + " " + nachname + " <" + email + ">"; },
                    ["local>obj/vorname", "local>obj/nachname", "local>obj/email"])
                .addById("rowTemplate");
        },

        createTempMap: function () {
            var map = {};
            return {
                getOrCreate: function (key) {
                    map[key] = map[key] || {};
                    return map[key];
                }
            }
        },

        doAdd: function () {
            var data = this.getModel().getProperty("/data");
            var newData = data.concat([DataService.generateBenutzer()]);
            this.getModel().setProperty("/data", newData);
        },

        startEditing: function (oEvent) {
            var bindingContext = this.getBindingContextForEvent(oEvent, "local");
            var email = bindingContext.getProperty("obj/email");
            bindingContext.setProperty("temp/editEmail", email);
            bindingContext.setProperty("temp/editMode", true);
        },

        saveChanges: function (oEvent) {
            var bindingContext = this.getBindingContextForEvent(oEvent, "local");
            var email = bindingContext.getProperty("temp/editEmail");
            bindingContext.setProperty("obj/email", email);
            bindingContext.setProperty("temp/editMode", false);
        },

        cancelEditing: function (oEvent) {
            var bindingContext = this.getBindingContextForEvent(oEvent, "local");
            bindingContext.setProperty("temp/editMode", false);
        }
    });
});
