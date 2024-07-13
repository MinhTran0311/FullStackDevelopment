import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    replaceBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { replaceBlog, appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const notes = await blogService.getAll()
    dispatch(setBlogs(notes))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newNote = await blogService.createNew(content)
    dispatch(appendBlog(newNote))
  }
}

export const likeBlog = (blogToChange) => {
  return async dispatch => {
    const updatedBlog = { ...blogToChange, votes: blogToChange.votes + 1 }
    const returnedBlog = await blogService.updateVote(blogToChange.id, updatedBlog)
    dispatch(replaceBlog(returnedBlog))
  }
}

export default blogSlice.reducer