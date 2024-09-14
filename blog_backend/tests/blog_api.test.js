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

test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test.only('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((e) => e.title);
  // is the argument truthy
  assert(titles.includes('HTML is easy'));
});

test('blog posts contains id property', async () => {
  const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
  };
  const randomBlog = async () => {
    const blogs = await blogsInDb();
    return blogs[Math.floor(Math.random() * blogs.length)];
  };

  const aBlog = await randomBlog();
  assert.ok(aBlog.id !== undefined, 'Blog post should have an id property');
});

after(async () => {
  await mongoose.connection.close();
});
