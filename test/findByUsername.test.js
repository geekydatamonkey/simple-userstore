import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';


// users.findByUsername()
test('findByUsername() returns a user given a username', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  await users.createUser({
    username: 'jerry',
    password: 'Hello ... Newman',
  });

  const jerry = await users.findByUsername('jerry');
  t.is(jerry.username, 'jerry');
  t.truthy(jerry.createdAt);
  t.truthy(jerry.updatedAt);
});

test('findByUsername() does NOT return the password prop within the user object', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  await users.createUser({
    username: 'jerry',
    password: 'Hello ... Newman',
  });
  const jerry = await users.findByUsername('jerry');
  // password should be blaclisted
  t.is(jerry.password, undefined);
});
