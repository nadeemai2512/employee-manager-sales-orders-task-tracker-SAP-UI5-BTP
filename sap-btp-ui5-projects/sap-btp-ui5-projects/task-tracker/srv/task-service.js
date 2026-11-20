const cds = require('@sap/cds');

const PRIORITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Open', 'InProgress', 'Done'];

module.exports = class TaskService extends cds.ApplicationService {
  init() {
    const { Tasks } = this.entities;

    this.before(['CREATE', 'UPDATE'], 'Tasks', (req) => {
      const d = req.data;
      if (d.priority && !PRIORITIES.includes(d.priority)) req.error(400, `Priority must be one of ${PRIORITIES.join(', ')}`, 'priority');
      if (d.status && !STATUSES.includes(d.status)) req.error(400, `Status must be one of ${STATUSES.join(', ')}`, 'status');
    });

    this.on('setStatus', 'Tasks', async (req) => {
      const key = req.params[0];
      const ID = typeof key === 'object' ? key.ID : key;
      const { status } = req.data;
      if (!STATUSES.includes(status)) return req.error(400, `Status must be one of ${STATUSES.join(', ')}`);
      const n = await UPDATE(Tasks, ID).with({ status });
      if (!n) return req.error(404, 'Task not found');
      return SELECT.one.from(Tasks, ID);
    });

    this.on('summary', async () => {
      const rows = await SELECT.from(Tasks).columns('status', 'dueDate');
      const today = new Date().toISOString().slice(0, 10);
      const count = (s) => rows.filter(r => r.status === s).length;
      return {
        total: rows.length,
        open: count('Open'),
        inProgress: count('InProgress'),
        done: count('Done'),
        overdue: rows.filter(r => r.status !== 'Done' && r.dueDate && r.dueDate < today).length
      };
    });

    return super.init();
  }
};
