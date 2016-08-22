import test from 'ava';
import tempfile from 'tempfile';
import UserStore from '../src';

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
