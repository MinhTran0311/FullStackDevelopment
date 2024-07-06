const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Flutter patterns",
    author: "Minhhhh",
    url: "https://reactpatterns.com/",
    likes: 100,
  },
];

const initialUsers = [
  {
    username: "hellas",
    name: "Arto Hellas",
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const getToken = async () => {
  // let user = await User.findOne({ username: 'root' });

  const username = "testuser";
  const name = "testuser";
  const password = "testuser";
  let user = await User.findOne({ username });

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = new User({
      username,
      name,
      passwordHash,
    });
    user = await user.save();
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return { token, user };
};

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
  getToken,
};
