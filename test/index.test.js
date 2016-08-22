import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

// users.setUsername()
test('setUsername() changes the username for a given userId', async t => {
  const dbfile = tempfile('.db');
  const users = new UserStore(dbfile);

  const userId = await users.createUser({
    username: 'elaine',
    password: '12345',
  });

  const anotherUser = await users.createUser({
    username: 'ebenes',
    password: '12345',
  });

  // prevent collisions
  try {
    await users.setUsername(userId, 'ebenes');
    t.fail('setting a duplicate username should throw');
  } catch (err) {
    t.pass();
  }

  await users.setUsername(userId, 'ebenes2');
  const user = await users.db.findOne({ _id: userId });

  // should touch the updatedAt date
  t.truthy(user.createdAt !== user.updatedAt);
  t.is(user.username, 'ebenes2');
});

test.todo('setUsername() throws error if no user exists with userId');

// setPassword()
test.todo('setPassword() changes the password for a given userId');
test.todo('setPassword() throws error if no user exists with userId');

// removeUser()
test.todo('removeUser() removes a user with the given userId');
test.todo('removeUser() throws error if no user exists with userId');
