const cds = require('@sap/cds');

const round2 = (n) => Math.round(n * 100) / 100;

module.exports = class SalesService extends cds.ApplicationService {
  init() {
    const { Orders, OrderItems } = this.entities;

    // number the order, compute item amounts and the order total on create
    this.before('CREATE', 'Orders', async (req) => {
      const items = req.data.items || [];
      if (!items.length) return req.error(400, 'An order needs at least one item', 'items');
      let total = 0;
      for (const it of items) {
        if (!it.quantity || it.quantity <= 0) return req.error(400, 'Quantity must be greater than 0', 'quantity');
        if (it.price === undefined || it.price === null || Number(it.price) < 0) return req.error(400, 'Price must not be negative', 'price');
        it.amount = round2(it.quantity * Number(it.price));
        total += it.amount;
      }
      req.data.total = round2(total);
      const r = await SELECT.one.from(Orders).columns('max(orderNo) as m');
      req.data.orderNo = ((r && r.m) || 1000) + 1;
      req.data.status = 'Open';
    });

    this.before('CREATE', 'OrderItems', (req) => {
      if (!req.data.quantity || req.data.quantity <= 0) return req.error(400, 'Quantity must be greater than 0', 'quantity');
      req.data.amount = round2(req.data.quantity * Number(req.data.price || 0));
    });

    const setStatus = async (req, allowedFrom, newStatus) => {
      const key = req.params[0];
      const ID = typeof key === 'object' ? key.ID : key;
      const order = await SELECT.one.from(Orders, ID);
      if (!order) return req.error(404, 'Order not found');
      if (!allowedFrom.includes(order.status)) {
        return req.error(409, `Order ${order.orderNo} is ${order.status}; action not allowed`);
      }
      await UPDATE(Orders, ID).with({ status: newStatus });
      return SELECT.one.from(Orders, ID);
    };

    this.on('submitOrder', 'Orders', (req) => setStatus(req, ['Open'], 'Submitted'));
    this.on('cancelOrder', 'Orders', (req) => setStatus(req, ['Open', 'Submitted'], 'Cancelled'));

    return super.init();
  }
};
