// init.js

db = db.getSiblingDB('foo');

// Create a user with readWrite privileges
db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'foo' }]
});

// Create a collection named "roger" with fields name, email, and message
db.roger.insert({
  name: 'Roger',
  email: 'roger@example.com',
  message: 'Hello, MongoDB!'
});

