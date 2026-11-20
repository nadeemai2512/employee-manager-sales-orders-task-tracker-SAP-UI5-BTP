const cds = require('@sap/cds');

module.exports = class HRService extends cds.ApplicationService {
  init() {
    const { Employees } = this.entities;

    this.before(['CREATE', 'UPDATE'], 'Employees', (req) => {
      const d = req.data;
      if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) req.error(400, 'Invalid e-mail address', 'email');
      if (d.salary !== undefined && d.salary !== null && Number(d.salary) < 0) req.error(400, 'Salary must not be negative', 'salary');
    });

    this.on('stats', async () => {
      const rows = await SELECT.from(Employees).columns('salary', 'active');
      const total = rows.length;
      const active = rows.filter(r => r.active).length;
      const sum = rows.reduce((s, r) => s + Number(r.salary || 0), 0);
      return { total, active, avgSalary: total ? Math.round((sum / total) * 100) / 100 : 0 };
    });

    return super.init();
  }
};
