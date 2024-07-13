import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="title"
        />
      </div>
      <div>
        author
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="author"
        />
      </div>
      <div>
        url
        <input value={url} onChange={({ target }) => setUrl(target.value)} placeholder="url" />
      </div>
      <button type="submit">save</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
