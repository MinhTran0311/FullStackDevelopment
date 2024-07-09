const Notification = (props) => {
  if (props.notiMessage.message === null || props.notiMessage.message === '') {
    return null
  }

  const notificationStyle = {
    color: props.notiMessage.isSuccess ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    border: `2px solid ${props.notiMessage.isSuccess ? 'green' : 'red'}`,
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={notificationStyle}>{props.notiMessage.message}</div>
  )
}

export default Notification
