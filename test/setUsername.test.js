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

  // create a user that will conflict with the username change
  await users.createUser({
    username: 'ebenes',
    password: '12345',
  });

  // prevent collisions
  try {
    // ebenes username is already assigned, so an error should be thrown
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

test('setUsername() throws error if no user exists with userId',
  async t => {
    const dbfile = tempfile('.db');
    const users = new UserStore(dbfile);
    const badUserId = 12345;
    try {
      await users.setUsername(badUserId, 'someone');
      t.fail('using a bad userId should throw an error');
    } catch (err) {
      // console.error(err);
      t.pass('bad userId correctly threw an error');
    }
  }
);
