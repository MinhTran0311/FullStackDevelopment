import { useSelector } from 'react-redux'
import { Alert, AlertTitle } from '@mui/material'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const isSuccess = notification.isSuccess
  if (!notification.message){
    return
  }
  const severity = notification.isSuccess ? 'success' : 'error'

  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      <AlertTitle>{notification.isSuccess ? 'Success' : 'Error'}</AlertTitle>
      {notification.message}
    </Alert>
  )
}

export default Notification