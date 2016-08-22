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
