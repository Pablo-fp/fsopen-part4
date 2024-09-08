const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Jonhy',
    url: 'www.jonhy.com',
    likes: 5
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Carla',
    url: 'www.carla.com',
    likes: 11
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialNotes.length);
});

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((e) => e.title);
  // is the argument truthy
  assert(titles.includes('HTML is easy'));
});

after(async () => {
  await mongoose.connection.close();
});
