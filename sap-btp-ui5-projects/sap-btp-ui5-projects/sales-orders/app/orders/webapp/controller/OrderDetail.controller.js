sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.demo.orders.controller.OrderDetail", {

    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onMatched, this);
    },

    _t: function (k) { return this.getView().getModel("i18n").getResourceBundle().getText(k); },

    _onMatched: function (oEvent) {
      var sId = oEvent.getParameter("arguments").orderId;
      this.getView().bindElement({
        path: "/Orders(" + sId + ")",
        parameters: { $expand: "items,customer" }
      });
    },

    onNavBack: function () { this.getOwnerComponent().getRouter().navTo("list", {}, true); },

    _runAction: function (sAction, sMsgKey) {
      var that = this, oCtx = this.getView().getBindingContext();
      var oOp = this.getView().getModel().bindContext("SalesService." + sAction + "(...)", oCtx);
      oOp.execute().then(function () {
        oCtx.refresh();
        MessageToast.show(that._t(sMsgKey));
      }).catch(function (e) {
        MessageBox.error(e.message || that._t("errorGeneric"));
      });
    },

    onSubmit: function () { this._runAction("submitOrder", "orderSubmitted"); },
    onCancelOrder: function () { this._runAction("cancelOrder", "orderCancelled"); }
  });
});
