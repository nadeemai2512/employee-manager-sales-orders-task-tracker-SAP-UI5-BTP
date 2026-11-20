using com.demo.hr as db from '../db/schema';

@path: 'hr'
service HRService {
  entity Departments as projection on db.Departments;
  entity Employees   as projection on db.Employees;

  type Stats { total : Integer; active : Integer; avgSalary : Decimal(10,2); };
  function stats() returns Stats;
}
