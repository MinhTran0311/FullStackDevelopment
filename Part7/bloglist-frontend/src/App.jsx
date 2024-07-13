import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/Login'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

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

  // const showMessage = (message, isSuccess) => {
  //   setNotiMessage({
  //     message: message,
  //     isSuccess: isSuccess,
  //   })
  //   setTimeout(() => {
  //     setNotiMessage({ ...notiMessage, message: null })
  //   }, 5000)
  // }

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await loginService.login({
        username, password,
      })
      blogService.setToken(response.data.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(response.data)
      )
      setUser(response.data)
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
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
      dispatch(setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, true))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
      return returnedBlog
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
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
        dispatch(setNotification(exception.message, false))
      }
    }
  }

  const loginForm = () => (<>
    <h2>Log in to application</h2>
    <Notification />
    <LoginForm doLogin={handleLogin}/>
  </>
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
          <Notification />
          <p>{user.name} logged in <button onClick={handleLogout} id='logout-button'>logout</button></p>
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