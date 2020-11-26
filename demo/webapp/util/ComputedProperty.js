sap.ui.define([
    "sap/ui/core/Element",
], function (
    Element,
) {
    "use strict";

    return Element.extend("ui5-demo.util.ComputedProperty", {
        metadata: {
            properties: {
                label: {type: "string"},
                var: {type: "any"},
                value: {type: "any"}
            },
        },

        setValue: function (value) {
            this.setVar(value);
            console.log(`Computed property (${this.getLabel()}) was updated to: ${value}`);
        }

    });
});
