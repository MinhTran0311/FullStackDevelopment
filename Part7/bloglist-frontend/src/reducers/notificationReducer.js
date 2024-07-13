import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, isSuccess: true },
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear() {
      return ''
    }
  }
})

export const setNotification = (message, isSuccess, duration = 5) => {
  return dispatch => {
    dispatch(set({ message, isSuccess }))
    setTimeout(() => {
      dispatch(clear())
    }, duration * 1000)
  }
}

export const { set, clear } = notificationSlice.actions
export default notificationSlice.reducer
