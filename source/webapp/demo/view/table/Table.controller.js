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
            // ComputedProperty which counts the entries in data.
            new ComputedPropertyBuilder(this, "local>/count")
                .withFunction(function (data) { return data.length; }, ["/data"])
                .add();

            // ComputedProperty 'local>/wrappedData' is a transformation of 'local>/data' combining references to
            // the original objects with temporary data. To preserve the temporary data when the ComputedProperty is
            // recalculated, a temporary map indexed by 'login' key is used.
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
                .withFunction(wrappingFunction, ["/data"])
                .add();

            // ComputedProperty 'prettyEmail' is defined relative to each row entry.
            // Therefore the ComputedProperty element is added to the row template.
            new ComputedPropertyBuilder(this, "local>temp/prettyEmail")
                .withFunction(
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
            // It's important to really update the '/data' property for the ComputedProperty defined from it to work.
            // Therefore we don't use  .push(..) which would modify the list in-place, but .concat(..).
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
