// UserStore
// simple way to create and authenticate users
// in an NeDB database

import NeDB from 'nedb-promise';
import bcrypt from 'bcryptjs';

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

  _isValidUsername(username) {
    if (!username) {
      // console.error('No username given');
      return false;
    }

    if (typeof username !== 'string') { return false; }

    // must start with letter or underscore
    // and contain only letters, numbers and _, -
    if (!username.match(/^[A-Z_][-_A-Z0-9]*$/i)) {
      return false;
    }
    return true;
  }

  // tests that the given username isn't already
  // used within the datastore
  async _isUsernameUnique(username) {
    const existingUser = await this.findByUsername(username);
    if (!existingUser) {
      return true;
    }
    return false;
  }

  // encrypts a password
  async _hash(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPass) => {
        if (err) return reject(err);
        return resolve(hashedPass);
      });
    });
  }

  async createUser({ username, password }) {
    if (!this.db) {
      throw new Error('No database was loaded. Cannot create user.');
    }

    const trimmedUsername = username.trim();

    // check if username is valid
    if (!(this._isValidUsername(trimmedUsername))) {
      throw new Error(`Username ${username} is not valid.`);
    }

    // check if username is unique
    if (!(await this._isUsernameUnique(trimmedUsername))) {
      throw new Error(`User '${username}' already exists. Usernames must be unique.`);
    }

    if (!password) throw new Error('No password provided.');

    const now = new Date();
    return this.db.insert({
      username: trimmedUsername,
      password: await this._hash(password),
      createdAt: now,
      updatedAt: now,
    })
    .then((user) => {
      return user._id;
    })
    .catch(console.error);
  }

  async findByUsername(username) {
    if (!this.db) throw new Error('No database loaded.');

    return this.db.find({ username })
      .then(users => {
        // null if no users found
        if (!users.length) return null;

        // this should never happen
        if (users.length > 1) {
          throw new Error(
            `Expected only one user with username '${username}'. ` +
            `Found ${users.length} instead.`
          );
        }

        const user = users[0];

        // blacklist the password field
        const safeUser = {};
        Object.keys(user)
          .filter(key => {
            return key !== 'password';
          })
          .forEach(key => {
            safeUser[key] = user[key];
          });

        return safeUser;
      });
  }

  authenticate({ username, password }) {
    return new Promise((resolve, reject) => {
      if (!username || !password) {
        return reject('no username or password provided');
      }

      // use raw db.findOne to get user with
      // hashed password
      return this.db.findOne({ username })
        .then((user) => {
          if (!user) return resolve(false);

          return bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return reject(err);
            return resolve(isMatch);
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  async setUsername(userId, username) {
    if (! this._isValidUsername(username)) {
      throw new Error(`invalid username ${username}`);
    }

    if (!(await this._isUsernameUnique(username))) {
      throw new Error(`username '${username} is already taken'`);
    }

    // const user = this.db.find({ _id: userId });
    //
    // if (!user) {
    //   throw new Error(`userId '${userId} does not correspond to a valid user'`);
    // }

    const numUpdated = await this.db.update(
      { _id: userId },
      { $set: {
        username,
        updatedAt: new Date(),
      } },
    );

    if (numUpdated === 0) {
      throw new Error(`userId '${userId} does not correspond to a valid user'`);
    }
    if (numUpdated > 1) {
      throw new Error(`More than one username was updated to ${username}. This should not happen.`);
    }
    return true;
  }
}
