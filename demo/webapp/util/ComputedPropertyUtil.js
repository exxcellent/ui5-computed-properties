sap.ui.define([
    "./ComputedProperty",
], function (
    ComputedProperty,
) {
    "use strict";

    return {
        addComputedProperty: function (parentElement, varName, expressionBinding) {
            const varBinding = `{${varName}}`;
            const config = {
                label: varName,
                var: varBinding,
                value: expressionBinding
            };
            const derivedVariable = new ComputedProperty(config);
            console.log("Adding computed property:", config);
            parentElement.addAggregation("dependents", derivedVariable);
        },

        buildFuncExpressionBinding: function (funcModel, func, ...params) {
            const randomNr = Math.floor(Math.random() * 1000000);
            const funcName = `${func.name}_${randomNr}`;
            const paramsString = params
                .map(p => `%{${p}}`)
                .join(",");
            funcModel.setProperty("/" + funcName, func);
            return `{= %{$funcs>/${funcName}}(${paramsString}) }`;
        }

    };
});
