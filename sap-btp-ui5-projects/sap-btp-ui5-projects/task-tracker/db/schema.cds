namespace com.demo.tasks;

using { cuid, managed } from '@sap/cds/common';

entity Tasks : cuid, managed {
  title       : String(120) @mandatory;
  description : String(500);
  priority    : String(10) default 'Medium';     // High | Medium | Low
  status      : String(12) default 'Open';       // Open | InProgress | Done
  dueDate     : Date;
  assignee    : String(60);
}
