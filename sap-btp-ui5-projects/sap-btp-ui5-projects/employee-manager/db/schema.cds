namespace com.demo.hr;

using { cuid, managed } from '@sap/cds/common';

entity Departments : cuid {
  name     : String(60) @mandatory;
  location : String(60);
}

entity Employees : cuid, managed {
  firstName   : String(60) @mandatory;
  lastName    : String(60) @mandatory;
  email       : String(120);
  jobTitle    : String(80);
  salary      : Decimal(10,2);
  joiningDate : Date;
  active      : Boolean default true;
  department  : Association to Departments;
}
