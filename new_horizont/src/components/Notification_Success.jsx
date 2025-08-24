import "../styles/Notifications.css";

export default function Notification_Success() {
  return (
    <div className="container">
      <div className="notification notification-success">
        <div className="notification_body">
          <i className="fa-solid fa-circle-check"></i>
          <p>Tu cuenta se creo exitosamente.</p>
        </div>
        <div className="notification_progress"></div>
      </div>
    </div>
  );
}
