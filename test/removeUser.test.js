import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

// removeUser()
test('removeUser() removes a user with the given userId', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  const userId = await users.createUser({
    username: 'jerry',
    password: '12345',
  });
  t.truthy(await users.findByUsername('jerry'));

  await users.removeUser(userId);
  t.falsy(await users.findByUsername('jerry'));
});

test('removeUser() returns false if user was not deleted', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  t.falsy(await users.removeUser('badUserId'));
});
