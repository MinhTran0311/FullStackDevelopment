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
    const { user } = await helper.getToken();

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      blogObject.user = user;
      await blogObject.save();
    }
  });
  describe("viewing a blog", () => {
    test("there are two blogs", async () => {
      const { token } = await helper.getToken();

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);

      assert.strictEqual(response.body.length, blogsAtStart.length);
    });

    test("a specific blog can be viewed", async () => {
      const { token } = await helper.getToken();
      const blogsAtStart = await helper.blogsInDb();

      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });
  });
  describe("adding a blog", () => {
    test("a valid blog can be added ", async () => {
      const { token } = await helper.getToken();
      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((n) => n.title);

      assert(titles.includes("Hai"));
    });

    test("a blog without likes defaults to 0", async () => {
      const { token } = await helper.getToken();
      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("blog without title is not added", async () => {
      const { token } = await helper.getToken();
      const newBlog = {
        author: "Vu Dinh Khang",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("blog without url is not added", async () => {
      const { token } = await helper.getToken();

      const newBlog = {
        title: "Hai",
        author: "Vu Dinh Khang",
        likes: 50,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("adding a blog fails with status code 401 if a token is not provided", async () => {
      const newBlog = {
        title: "Unauthorized Blog",
        author: "Unauthorized Author",
        url: "http://unauthorized.url",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const { token } = await helper.getToken();
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });
  });

  describe("updating a blog", () => {
    test("succeeds with valid data and token", async () => {
      const { token } = await helper.getToken();
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedBlogData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 10);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id
      );
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
