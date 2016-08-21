import test from 'ava';

// new UserStore()
test.todo('new UserStore is empty');
test.todo('new UserStore({filename}) automatically loads data from filename');
test.todo('new Userstore() takes a password schema as an option');

// users.load()
test.todo('users.load(filename) will load data from filename');
test.todo('cannot load data from a file more than once.' +
  ' users.load() throws error if UserStore(filename) was already used');

// users.createUser()
test.todo('createUser() creates new user, returns the _id');
test.todo('createUser() adds createdAt and updatedAt fields with current timestamp');

// users.createUser() validation of username
test.todo('createUser() requires a username');
test.todo('createUser() throws error if username is not unique');
test.todo('createUser() usernames must start with letter or underscore');
test.todo('createUser() usernames can only contain letters, numbers, underscores, hyphens');

// users.createUser() validation of password
test.todo('createUser() hashes password');
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
