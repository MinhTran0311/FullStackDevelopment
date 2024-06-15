const Notification = ({ message }) => {
  if (message === null || message === "") {
    return null;
  }

  return <div className="success">{message}</div>;
};

export default Notification;
