# Simple UserStore

Simple storage of user info. Nothing fancy. Uses NeDB underneath.

## Installation

```
npm install --save simple-userstore
```

## Usage

```js
import UserStore from 'simple-userstore';

const users = new UserStore('users.db');

users.createUser({ username: 'jerry', password: 'Hello, Newman.'});
users.authenticate({ username: 'jerry', password: 'Hello, Newman.'});
// true

const jerry = users.findByUsername('jerry')
// {
//   _id: ...,
//   username: 'jerry',
//   createdAt: ...some Date...
//   updatedAt: ...some Date...
// }

users.setPassword(jerry._id, '12345');
users.setUsername(jerry._id, 'jerome');
users.authenticate({ username: 'jerome', password: '12345'});
// true

users.removeUser(jerry._id);
```

## API

### `const users = new UserStore(opts)`

Constructor for a new place to store users.

*Parameters:*
  - `opts.filename` (optional). The place where data is stored. Previous data will be automatically loaded from the filename.

*Returns:* a userstore

### `users.load(filename)`

Loads data from a filename.

This should only be used if filename isn't specified when `users` is instantiated. If filename is given when instantiating `users`, the data will be automatically loaded.

*Returns:* a promise for users instance with loaded data

### `users.createUser({ username, password })`

Creates a new user with the giving username, and password.

Username must be unique or an error will be thrown.

*Returns:* Promise for user id of newly created user

### `users.authenticate({ username, password })`

Checks a given username and password against value currently stored in the database.

*Returns:* Promise for boolean. True if username/password is valid.

### `users.findByUsername(username)`

*Returns:* Promise for a user object that matches a given username. If no user is found, null is returned.

The hashed password is NOT included with this user object. To check if a password is valid for this user, use `users.authenticate()` instead

### `users.setUsername(userId, newUsername)`

Changes the username for a given user (with `_id === userId`)

### `users.setPassword(userId, newPassword)`

Changes the password for a given user.

### `users.removeUser(userId)`

Removes a given user from the database.
