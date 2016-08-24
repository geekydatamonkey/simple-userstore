import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

// setPassword()
test('setPassword() changes the password for a given userId', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  const userId = await users.createUser({
    username: 'jerry',
    password: '12345',
  });

  t.truthy(await users.authenticate({ username: 'jerry', password: '12345' }));

  await users.setPassword(userId, 'abab1212');

  t.falsy(await users.authenticate({ username: 'jerry', password: '12345' }));
  t.truthy(await users.authenticate({ username: 'jerry', password: 'abab1212' }));
});

test('setPassword() throws error if no user exists with userId', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  try {
    await users.setPassword('badUserId', '12345');
    t.fail('setPassword should throw an error with bad user id');
  } catch (err) {
    // console.error(err);
    t.pass('setPassword correctly throws an error with bad user id');
  }
});
