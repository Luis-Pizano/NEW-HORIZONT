import "../styles/Notifications.css";

export default function Notification_Info({message}) {
  return (
    <div className="container">
      <div className="notification notification-info">
        <div className="notification_body">
          <i class="fa-solid fa-circle-info"></i>
          <p>{message}</p>
        </div>
        <div className="notification_progress"></div>
      </div>
    </div>
  );
}
