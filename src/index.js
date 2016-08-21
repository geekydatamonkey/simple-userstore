// UserStore
// simple way to create and authenticate users
// in an NeDB database

import NeDB from 'nedb-promise';

export default class UserStore {
  constructor(filename) {
    this.db = null;

    if (filename) {
      this.db = new NeDB({
        filename,
        autoload: true,
      });
    }
  }

  load(filename) {
    // if there's already a database, throw an error
    if (this.db) {
      throw new Error('Database already loaded when this UserStore was instantiated.');
    }

    this.db = new NeDB({
      filename,
      autoload: true,
    });
  }
}
