sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element"
], function (
    Log,
    Element
) {
    "use strict";

    return Element.extend("computed-properties-lib.ComputedProperty", {
        metadata: {
            properties: {
                label: {type: "string"},
                var: {type: "any"},
                value: {type: "any"}
            },
        },

        setValue: function (value) {
            this.setProperty("value", value);
            if (this.getProperty("var") !== value) {
                this.setProperty("var", value);
                Log.debug("Updating computed property '" + this.getLabel() + "' to: " + value, null, "computed-property");
            }
        }

    });
});
