sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element"
], function (
    Log,
    Element
) {
    "use strict";

    /**
     * ComputedProperty is a custom element that is used in a view to calculate intermediate results.
     * It's recommended to put it inside a 'dependents' aggregation.
     *
     * <h3>Overview</h3>
     *
     * ComputedProperty has two property bindings, 'var' and 'value'.
     * Whenever the content of 'value' changes, it is propagated to 'var'.
     *
     * This element logs on debug level as component "computed-property", so you can filter for this text.
     *
     * <h3>Example</h3>
     *
     * <pre>
     * <Page>
     *      <dependents>
     *          <cpl:ComputedProperty   var="{/computed}"
     *                                  value="{= %{/var1}+%{/var2} }" />
     *      </dependents>
     * ...
     * </pre>
     */
    return Element.extend("computed-properties-lib.ComputedProperty", {
        metadata: {
            properties: {
                /**
                 * Binding for computed property "variable", evaluation result of 'value' is stored here.
                 */
                var: {type: "any"},

                /**
                 * Binding for value that gets evaluated. Its result is propagated to 'var'.
                 */
                value: {type: "any"},

                /**
                 * Optional, only used for log messages.
                 */
                label: {type: "string"}
            }
        },

        /**
         * Called automatically whenever binding value changes.
         *
         * @param {object} value - new evaluated value
         */
        setValue: function (value) {
            this.setProperty("value", value);
            if (this.getProperty("var") !== value) {
                this.setProperty("var", value);
                Log.debug("Updating computed property '" + this.getLabel() + "' to: " + JSON.stringify(value), null, "computed-property");
            }
        }

    });
});
