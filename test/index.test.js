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

// test.todo('new Userstore() takes a password schema as an option');

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
test('createUser() creates new user, returns the _id', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);

  const userId = await users.createUser({
    username: 'jerry',
    password: 'Hello... Newman.',
  });

  t.truthy(userId);
});

test('createUser() adds createdAt and updatedAt fields with current timestamp', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);

  await users.createUser({
    username: 'jerry',
    password: 'Hello... Newman.',
  });

  const jerry = await users.findByUsername('jerry');
  t.truthy(jerry.createdAt);
  t.truthy(jerry.updatedAt);
  t.is(jerry.createdAt, jerry.updatedAt);
});

// users.createUser() validation of username
test('createUser() requires a username', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);
  t.throws(() => {
    return users.createUser();
  });
});

test('createUser() throws error if username is not unique', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);
  const userId = await users.createUser({
    username: 'jerry',
    password: '12345',
  });

  t.truthy(userId);

  // try a second user with same username
  try {
    await users.createUser({
      username: 'jerry',
      password: '54321',
    });
  } catch (err) {
    t.is(err.message, 'User \'jerry\' already exists. Usernames must be unique.');
  }
});

test('createUser() usernames must start with letter or underscore', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);

  // try a number
  let invalidUserFromNumber;
  try {
    invalidUserFromNumber = await users.createUser({
      username: '1a',
      password: '123456',
    });
  } catch (err) {
    t.truthy(err instanceof Error);
  }
  t.falsy(invalidUserFromNumber);

  // try a special char
  let invalidUserFromSpecialChar;
  try {
    invalidUserFromSpecialChar = await users.createUser({
      username: '$pecial',
      password: '123456',
    });
  } catch (err) {
    t.truthy(err instanceof Error);
  }
  t.falsy(invalidUserFromSpecialChar);

  // try a letter
  let validUserId;
  try {
    validUserId = await users.createUser({
      username: 's1234',
      password: '123456',
    });
  } catch (err) {
    t.fail(err.message);
  }
  t.truthy(validUserId);

  // try an underscore
  let validUserId2;
  try {
    validUserId2 = await users.createUser({
      username: '__me__',
      password: '123456',
    });
  } catch (err) {
    t.fail(err.message);
  }
  t.truthy(validUserId2);
});

test('createUser() trims whitespace from usernames and passwords', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);

  await users.createUser({
    username: '   jerry   ',
    password: '12345',
  });

  const user = users.findByUsername('jerry');
  t.truthy(user);
});

// test valid users
const validUsernames = [
  'a1',
  'b2b2b2b',
  'hello_kitty',
  'mega-bot',
  '__MEGATRON__42-42',
];

validUsernames.forEach(validUsername => {
  test('createUser() should allow valid usernames', async t => {
    const filename = tempfile('.db');
    const users = new UserStore(filename);
    t.truthy(await users.createUser({
      username: validUsername,
      password: '12345',
    }));
  });
});

// Test Invalid Usernames
const invalidUsernames = [
  '1a',
  'a__ __ __',
  'a.b.c',
  'a{}',
  'a<HTML5>',
  'a•¡™£',
];

invalidUsernames.forEach(invalidUsername => {
  test('createUser() should throw an error for ' +
  'invalid usernames (anything other than letters, ' +
  'numbers, and hyphens)', async t => {
    const filename = tempfile('.db');
    const users = new UserStore(filename);
    try {
      await users.createUser({
        username: invalidUsername,
        password: '12345',
      });
      t.fail(`exception is not thrown for ${invalidUsername}`);
    } catch (err) {
      t.pass();
    }
  });
});

// users.createUser() validation of password
test('createUser() hashes password', async t => {
  const filename = tempfile('.db');
  const users = new UserStore(filename);

  const username = 'jerry';
  const password = 'hello... newman';

  const userId = await users.createUser({
    username,
    password,
  });

  // verify that the password isn't stored in cleartext
  const storedUser = await users.db.findOne({
    _id: userId,
  });

  t.not(storedUser.password, password);
  t.is(storedUser.username, username);
});

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
