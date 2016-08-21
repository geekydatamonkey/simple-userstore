import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

// new UserStore()
test('new UserStore() is empty', t => {
  const users = new UserStore();

  // users.db is a direct reference to the underlying NeDB database.
  t.is(users.db, null);
});

test('new UserStore({filename}) automatically loads data from filename', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  t.truthy(users.db);

  const userCollection = await users.db.find({});
  t.is(userCollection.length, 0);
});

test.todo('new Userstore() takes a password schema as an option');

// users.load()
test('users.load(filename) will load data from filename', async t => {
  const users = new UserStore();

  // no database on create
  t.is(users.db, null);

  // load a database file after instantiation
  const filename = tempfile('.db');
  users.load(filename);
  t.truthy(users.db);

  // database is ready for querying
  const userCollection = await users.db.find({});
  t.is(userCollection.length, 0);
});

test('cannot load data from a file more than once.' +
  ' users.load() throws error if UserStore(filename) was already used', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);
  t.truthy(users.db);
  t.throws(() => {
    users.load(filename);
  });
});

// users.createUser()
test.todo('createUser() creates new user, returns the _id');
test.todo('createUser() adds createdAt and updatedAt fields with current timestamp');

// users.createUser() validation of username
test.todo('createUser() requires a username');
test.todo('createUser() throws error if username is not unique');
test.todo('createUser() usernames must start with letter or underscore');
test.todo('createUser() usernames can only contain letters, numbers, underscores, hyphens');

// users.createUser() validation of password
test.todo('createUser() hashes password');
test.todo('createUser() requires a password at least 8 chars');

// users.findByUsername()
test.todo('findByUsername() returns a user given a username');
test.todo('findByUsername() does NOT return the password prop within the user object');

// users.authenticate()
test.todo('authenticate() checks that a given username/password is valid');

// users.setUsername()
test.todo('setUsername() changes the username for a given userId');
test.todo('setUsername() throws error if no user exists with userId');

// setPassword()
test.todo('setPassword() changes the password for a given userId');
test.todo('setPassword() throws error if no user exists with userId');

// removeUser()
test.todo('removeUser() removes a user with the given userId');
test.todo('removeUser() throws error if no user exists with userId');
