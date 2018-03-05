//data service
export default class DataSvc {
  static getData() {
    return new Promise((resolve) => {
      const data = require('../data/db.json');
      resolve(data);
    })
  }
}