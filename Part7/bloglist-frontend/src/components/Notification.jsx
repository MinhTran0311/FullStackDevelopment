import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const isSuccess = notification.isSuccess
  if (!notification.message){
    return
  }
  const notificationStyle = {
    color: isSuccess ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    border: `2px solid ${isSuccess ? 'green' : 'red'}`,
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div id="noti" style={notificationStyle}>{notification.message}</div>
  )
}

export default Notification