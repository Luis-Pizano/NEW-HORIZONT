import "../styles/Notifications.css";

export default function Notification_Error() {
  return (
    <div className="container">
      <div className="notification notification-failure">
        <div className="notification_body">
          <i className="fa-solid fa-circle-exclamation"></i>
          <p>Error al crear tu cuenta.</p>
        </div>
        <div className="notification_progress"></div>
      </div>
    </div>
  );
}
