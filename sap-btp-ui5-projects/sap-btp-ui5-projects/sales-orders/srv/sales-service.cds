using com.demo.sales as db from '../db/schema';

@path: 'sales'
service SalesService {
  entity Customers  as projection on db.Customers;
  entity OrderItems as projection on db.OrderItems;
  entity Orders     as projection on db.Orders
    actions {
      action submitOrder() returns Orders;
      action cancelOrder() returns Orders;
    };
}
