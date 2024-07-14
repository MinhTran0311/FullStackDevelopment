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
import { initializeBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'

const App = () => {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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

  const loginForm = () => (<>
    <h2>Log in to application</h2>
    <Notification />
    <LoginForm doLogin={handleLogin}/>
  </>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm />
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
          <BlogList />
        </div>
      }

    </div>
  )
}

export default App