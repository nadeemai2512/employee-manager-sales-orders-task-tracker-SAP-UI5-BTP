sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.demo.orders.controller.OrderList", {

    _t: function (k) { return this.getView().getModel("i18n").getResourceBundle().getText(k); },

    onOrderPress: function (oEvent) {
      var sId = oEvent.getSource().getBindingContext().getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("detail", { orderId: sId });
    },

    onNewOrder: function () {
      this.byId("inProduct").setValue("");
      this.byId("inQty").setValue("1");
      this.byId("inPrice").setValue("");
      this.byId("newOrderDialog").open();
    },

    onCancelDialog: function () { this.byId("newOrderDialog").close(); },

    onCreate: function () {
      var that = this;
      var sCustomer = this.byId("selCustomer").getSelectedKey();
      var sProduct = this.byId("inProduct").getValue().trim();
      var iQty = parseInt(this.byId("inQty").getValue(), 10);
      var fPrice = parseFloat(this.byId("inPrice").getValue());
      if (!sCustomer || !sProduct || !(iQty > 0) || isNaN(fPrice)) {
        MessageBox.warning(this._t("fillRequired")); return;
      }
      var oBinding = this.byId("orderTable").getBinding("items");
      var oCtx = oBinding.create({
        customer_ID: sCustomer,
        items: [{ product: sProduct, quantity: iQty, price: String(fPrice) }]
      });
      oCtx.created().then(function () {
        that.byId("newOrderDialog").close();
        MessageToast.show(that._t("orderCreated"));
        oBinding.refresh();
      }).catch(function (e) {
        if (!e.canceled) { MessageBox.error(e.message || that._t("errorGeneric")); }
      });
    }
  });
});
