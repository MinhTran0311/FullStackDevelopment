const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const assert = require("node:assert");
const helper = require("./test_helper");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("blog tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
  });
  describe("viewing a blog", () => {
    test("there are two blogs", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("a specific blog can be viewed", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });
  });
  describe("adding a blog", () => {
    test("a valid blog can be added ", async () => {
      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((n) => n.title);

      assert(titles.includes("Hai"));
    });

    test("a blog without likes defaults to 0", async () => {
      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("blog without title is not added", async () => {
      const newBlog = {
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("blog without url is not added", async () => {
      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
