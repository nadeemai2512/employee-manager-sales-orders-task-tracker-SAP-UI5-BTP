using com.demo.tasks as db from '../db/schema';

@path: 'tasks'
service TaskService {
  entity Tasks as projection on db.Tasks
    actions {
      action setStatus(status : String) returns Tasks;
    };

  type Summary { total : Integer; open : Integer; inProgress : Integer; done : Integer; overdue : Integer; };
  function summary() returns Summary;
}
