import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hook'

const Blog = () => {
  const { id } = useParams()
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === id)
  const currentUser = useSelector((state) => state.user)
  let commentId = 1
  const comment = useField('text', 'comment')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLike = async () => {
    try {
      dispatch(
        updateBlog({
          id: blog.id,
          user: blog.user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
          comments: blog.comments
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const udpateBlog = {
      ...blog,
      user: blog.user.id,
      comments: [...blog.comments, comment.value]
    }

    try {
      dispatch(updateBlog(udpateBlog))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    comment.reset()
  }
  console.log(blog)

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
      <div>
        <h3>comments</h3>
        <form onSubmit={handleSubmit}>
          <input
            value={comment.value}
            onChange={comment.onChange}
            type={comment.type}
            id={comment.id}
          />
          <button type="submit">add comment</button>
        </form>
        {blog.comments && <ul>
          {blog.comments.map((comment) => (
            <li key={commentId++}>{comment}</li>
          ))}
        </ul>}
      </div>
    </div>
  )
}

export default Blog
