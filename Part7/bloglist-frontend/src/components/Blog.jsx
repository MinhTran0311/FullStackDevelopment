import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = () => {
  const { id } = useParams()
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)
  const currentUser = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLike = async () => {
    try {
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
      navigate('/')

    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
  }

  const isAuthor = currentUser && blog.user.username === currentUser.username
  console.log(blog)
  return (
    <div className="blog">
      <h1>
        {blog.title} {blog.author}
      </h1>
      <p>{blog.url}</p>
      <p>
        {blog.likes} <button onClick={handleLike}>like</button>
      </p>
      <p>added by: {blog.user.username}</p>
      {isAuthor && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog
