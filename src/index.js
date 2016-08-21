// UserStore
// simple way to create and authenticate users
// in an NeDB database

import NeDB from 'nedb-promise';

export default class UserStore {

  // creates a new UserStore from a given (optional)
  // filename. If filename is not provided, no queries
  // will be possible until #load(filename) is called.
  constructor(filename) {
    this.db = null;

    if (filename) {
      this.db = new NeDB({
        filename,
        autoload: true,
      });
    }
  }

  // loads the data from filename into the database
  // provided, that a filename wasn't given when
  // UserStore was instantiated
  // Note that NeDB buffers any query issued before
  // autoload, so there's no need to make this an
  // asynchronous function
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

  createUser({ username, password }) {
    if (!this.db) {
      throw new Error('No database was loaded. Cannot create user.');
    }

    if (!username) throw new Error('No username provided.');

    if (!password) throw new Error('No password provided.');

    const now = new Date();
    return this.db.insert({
      username,
      password,
      createdAt: now,
      updatedAt: now,
    })
    .then((user) => {
      return user._id;
    })
    .catch(console.error);
  }

  findByUsername(username) {
    if (!this.db) throw new Error('No database loaded.');

    return this.db.find({ username })
      .then(users => {
        // null if no users found
        if (!users.length) return null;

        // this should never happen
        if (users.length > 1) {
          throw new Error(`Expected only one user with username '${username}'. Found ${users.length} instead.` )
        }

        const user = users[0];

        // blacklist the password field
        const safeUser = {};
        Object.keys(user)
          .filter(key => key !== 'password')
          .forEach(key => safeUser[key] = user[key]);

        return safeUser;
      });
  }
}
