import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ isAuthor, blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const dispatch = useDispatch()

  const [isShow, setIsShow] = useState(false)

  const toggleVisibility = (event) => {
    setIsShow(!isShow)
  }

  const handleLike = async () => {
    try {
      // const updatedBlog = { ...blog, likes: blog.likes + 1 }
      dispatch(
        likeBlog({
          id: blog.id,
          user: blog.user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
        })
      )
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteBlog(blog.id))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  if (!isShow) {
    return (
      <div style={blogStyle} className="blog">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{isShow ? 'hide' : 'view'}</button>
      </div>
    )
  }

  return (
    <div style={blogStyle} className="blog">
      <p>
        title: {blog.title}{' '}
        <button onClick={toggleVisibility}>{isShow ? 'hide' : 'view'}</button>
      </p>
      <p>url: {blog.url}</p>
      <p>
        likes: {blog.likes} <button onClick={handleLike}>like</button>
      </p>
      <p>author: {blog.author}</p>
      {isAuthor && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog
