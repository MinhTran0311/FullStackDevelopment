import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    if (!state.filter) {
      return [...state.anecdotes].sort((a, b) => b.votes - a.votes)
    } else {
      return [...state.anecdotes]
        .filter((e) => e.content.toLowerCase().includes(state.filter.toLowerCase()))
        .sort((a, b) => b.votes - a.votes)
    }
  })
  const dispatch = useDispatch()

  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id)

    dispatch(voteForAnecdote(id))
    dispatch(showNotification(`You voted for '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
