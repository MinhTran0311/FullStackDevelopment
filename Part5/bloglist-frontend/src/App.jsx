import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const [notiMessage, setNotiMessage] = useState({
    message: '',
    isSuccess: false,
  })

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (message, isSuccess) => {
    setNotiMessage({
      message: message,
      isSuccess: isSuccess,
    })
    setTimeout(() => {
      setNotiMessage({ ...notiMessage, message: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const response = await loginService.login({
        username, password,
      })
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(response.data)
      )
      setUser(response.data)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(exception.message, false)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
      showMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, true)
    } catch (exception) {
      showMessage(`${exception}`, false)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
      return returnedBlog
    } catch (exception) {
      showMessage(`${exception}`, false)
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find((e) => e.id === id)
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (confirmDelete) {
      try{
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter((e) => e.id !== id).sort((a, b) => b.likes - a.likes))
      }
      catch(exception){
        console.log(exception)
      }
    }
  }

  const loginForm = () => (<>
    <h2>Log in to application</h2>
    <Notification notiMessage={notiMessage} />
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form></>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        <div>
          {blogForm()}
          <h2>blogs</h2>
          <Notification notiMessage={notiMessage} />
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogs.map(blog =>
            <Blog key={blog.id}
              isAuthor={user.username===blog.user.username}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
            />
          )}
        </div>
      }

    </div>
  )
}

export default App