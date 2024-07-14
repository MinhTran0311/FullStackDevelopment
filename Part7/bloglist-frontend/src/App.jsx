import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import Menu from './components/Menu'
import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import Users from './components/Users'
import Blog from './components/Blog'

const App = () => {
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogPage = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <Notification />
      <BlogList />
    </>
  )

  const blogs = useSelector((state) => {
    return [...state.blogs]
  })

  const match = useMatch('/anecdotes/:id')
  const blog = match
    ? blogs.find(note => note.id === Number(match.params.id))
    : null

  return (
    <div>
      {user === null ? (
        <>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </>
      ) : (
        <div>
          <Menu />
          <h2>Blogs app</h2>
          <Routes>
            <Route path="/" element={blogPage()} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
