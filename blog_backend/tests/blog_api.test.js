const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 2);
});

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs');

  const contents = response.body.map((e) => e.content);
  // is the argument truthy
  assert(contents.includes('HTML is easy'));
});

after(async () => {
  await mongoose.connection.close();
});
