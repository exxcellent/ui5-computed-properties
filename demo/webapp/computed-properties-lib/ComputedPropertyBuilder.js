sap.ui.define([
    "sap/base/Log",
    "sap/ui/base/ManagedObject",
    "sap/ui/model/json/JSONModel",
    "./ComputedProperty"
], function (
    Log,
    ManagedObject,
    JSONModel,
    ComputedProperty
) {
    "use strict";

    return ManagedObject.extend("computed-properties-lib.ComputedPropertyBuilder", {

        // TODO: Avoid ES6 in lib
        // TODO: Linting

        constructor: function(oViewOrController, sVarName) {
            function getView(_oViewOrController) {
                if (_oViewOrController && _oViewOrController.getMetadata().isA("sap.ui.core.mvc.View")) {
                    return _oViewOrController;
                } else if (_oViewOrController && _oViewOrController.getMetadata().isA("sap.ui.core.mvc.Controller")) {
                    return getView(_oViewOrController.getView());
                }
                throw new Error("Parameter oViewOrController must be a sap.ui.core.mvc.View or sap.ui.core.mvc.Controller");
            }

            ManagedObject.call(this);
            if (typeof sVarName !== "string") {
                throw new Error("Parameter sVarName must be a string");
            }
            this.oView = getView(oViewOrController);
            this.sVarName = sVarName;
        },

        withFuncExpressionBinding: function (fFunc, aParams) {
            return this.withFuncExpressionBindingOnSpecificModel("$funcs", fFunc, aParams);
        },

        withFuncExpressionBindingOnSpecificModel: function (sFuncModelName, fFunc, aParams) {
            function getAndInitFuncModel(_oView, _sFuncModelName) {
                if (!_oView.getModel(_sFuncModelName)) {
                    _oView.setModel(new JSONModel({}), _sFuncModelName);
                }
                return _oView.getModel(_sFuncModelName);
            }

            if (typeof sFuncModelName !== "string") {
                throw new Error("Parameter sFuncModelName must be a string");
            }
            if (typeof fFunc !== "function") {
                throw new Error("Parameter fFunc must be a string");
            }
            if (!Array.isArray(aParams)) {
                throw new Error("Parameter aParams must be an array");
            }

            const randomNr = Math.floor(Math.random() * 1000000);
            const funcName = `${fFunc.name}_${randomNr}`;
            const paramsString = aParams
                .map(p => `%{${p}}`)
                .join(",");
            const oFuncModel = getAndInitFuncModel(this.oView, sFuncModelName);
            oFuncModel.setProperty("/" + funcName, fFunc);
            return this.withExpressionBinding(`{= %{${sFuncModelName}>/${funcName}}(${paramsString}) }`);
        },

        withExpressionBinding: function (sExpressionBinding) {
            if (typeof sExpressionBinding !== "string") {
                throw new Error("Parameter sExpressionBinding must be a string");
            }
            this.sExpressionBinding = sExpressionBinding;
            return this;
        },

        add: function () {
            const oParentControl = this.oView.getContent()[0];
            this.addToSpecificElement(oParentControl);
        },

        addById: function (sId) {
            const oParentControl = this.oView.byId(sId);
            this.addToSpecificElement(oParentControl);
        },

        addToSpecificElement: function (oControl) {
            const sVarBinding = `{${this.sVarName}}`;
            const oConfig = {
                label: this.sVarName,
                var: sVarBinding,
                value: this.sExpressionBinding
            };
            const oComputedProperty = new ComputedProperty(oConfig);
            Log.debug("Adding computed property '" + oConfig.label + "' with binding '" + oConfig.value + "'", null, "computed-property");
            oControl.addAggregation("dependents", oComputedProperty);
        }

    });
});
