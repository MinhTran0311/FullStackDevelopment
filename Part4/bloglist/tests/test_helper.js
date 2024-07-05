const Blog = require("../models/blog");
const User = require("../models/user");

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
    userId: "6686ebaf8cbc0e7e95d65181"
  }
];

const initialUsers = [
  {
    username: "hellas",
    name:"Arto Hellas",
  },
  {
    username: "mluukkai",
    name:"Matti Luukkainen",
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

  
module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb
};
