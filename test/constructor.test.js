import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

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
