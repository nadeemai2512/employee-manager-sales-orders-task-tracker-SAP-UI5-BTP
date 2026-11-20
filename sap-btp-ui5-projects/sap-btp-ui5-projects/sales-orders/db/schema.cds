namespace com.demo.sales;

using { cuid, managed } from '@sap/cds/common';

entity Customers : cuid {
  name    : String(100) @mandatory;
  email   : String(120);
  country : String(40);
}

entity Orders : cuid, managed {
  orderNo  : Integer @readonly;
  customer : Association to Customers @mandatory;
  status   : String(20) default 'Open';
  currency : String(3) default 'EUR';
  total    : Decimal(12,2) @readonly;
  items    : Composition of many OrderItems on items.order = $self;
}

entity OrderItems : cuid {
  order    : Association to Orders;
  product  : String(100) @mandatory;
  quantity : Integer;
  price    : Decimal(9,2);
  amount   : Decimal(12,2) @readonly;
}
