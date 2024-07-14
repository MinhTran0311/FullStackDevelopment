import { useField } from '../hook'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {
  const title = useField('text', 'title')
  const author = useField('text', 'author')
  const url = useField('text', 'url')
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    }

    try {
      dispatch(createBlog(newBlog))
      dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, true))
    } catch (exception) {
      dispatch(setNotification(exception.message, false))
    }
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={title.value}
          onChange={title.onChange}
          id={title.id}
          placeholder="title"
        />
      </div>
      <div>
        author
        <input
          value={author.value}
          onChange={author.onChange}
          id={author.id}
          placeholder="author"
        />
      </div>
      <div>
        url
        <input
          value={url.value}
          onChange={url.onChange}
          id={url.id}
          placeholder="url"
        />
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
