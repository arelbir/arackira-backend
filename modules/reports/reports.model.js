// modules/reports/reports.model.js
// Basit rapor modeli (örnek, genişletilebilir)

class Report {
  constructor({ id, name, created_at, data }) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.data = data;
  }
}

module.exports = Report;
