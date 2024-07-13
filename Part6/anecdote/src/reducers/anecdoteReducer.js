import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const notes = await anecdoteService.getAll()
    dispatch(setAnecdotes(notes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newNote))
  }
}

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToChange = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
    const returnedAnecdote = await anecdoteService.updateVote(id, updatedAnecdote)
    dispatch(voteAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer