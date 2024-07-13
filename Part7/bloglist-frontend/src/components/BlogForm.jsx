import PropTypes from 'prop-types'
import { useField } from '../hook'

const BlogForm = ({ createBlog }) => {
  const title = useField('text', 'title')
  const author = useField('text', 'author')
  const url = useField('text', 'url')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
