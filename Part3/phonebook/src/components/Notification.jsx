const Notification = (props) => {
  if (props.notiMessage.message === null || props.notiMessage.message === "") {
    return null;
  }

  return (
    <div className={props.notiMessage.isSuccess ? "success" : "error"}>{props.notiMessage.message}</div>
  );
};

export default Notification;
