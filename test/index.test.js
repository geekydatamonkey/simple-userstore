import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';


// users.authenticate()
test('authenticate() checks that a given username/password is valid', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  await users.createUser({
    username: 'jerry',
    password: 'Hello ... Newman',
  });

  t.falsy(await users.authenticate({
    username: 'jerry',
    password: 'bad password',
  }));

  t.truthy(await users.authenticate({
    username: 'jerry',
    password: 'Hello ... Newman',
  }));
});

// users.setUsername()
test.todo('setUsername() changes the username for a given userId');
test.todo('setUsername() throws error if no user exists with userId');

// setPassword()
test.todo('setPassword() changes the password for a given userId');
test.todo('setPassword() throws error if no user exists with userId');

// removeUser()
test.todo('removeUser() removes a user with the given userId');
test.todo('removeUser() throws error if no user exists with userId');
