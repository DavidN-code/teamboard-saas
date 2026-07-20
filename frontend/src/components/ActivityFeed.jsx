import { useEffect, useState } from "react";
import { getActivityFeed } from "../api/activityFeed";
import { useActiveBoard } from "../context/ActiveBoardContext";

function formatAction(activity) {
  const name = activity.userId?.name || "Unknown User";

  const changes = activity.details?.changes || [];

  if (activity.action === "CREATE_INVITATION") {
    return (
      <>
        {name} invited{" "}
        <strong>{activity.details?.inviteeEmail}</strong>
      </>
    );
  }

  if (activity.action === "RESEND_INVITATION") {
    return (
      <>
        {name} resent an invitation to{" "}
        <strong>{activity.details?.inviteeEmail}</strong>
      </>
    );
  }

  if (activity.action === "CREATE_TASK") {
    return (
      <>
        {name} created task{" "}
        <strong>"{activity.details?.taskTitle}"</strong>
      </>
    );
  }
  
  if (activity.action === "DELETE_TASK") {
    return (
      <>
        {name} deleted task{" "}
        <strong>"{activity.details?.taskTitle}"</strong>
      </>
    );
  }

  if (activity.action === "UPDATE_TASK" && changes.length > 0) {
    return (
      <>
        {name} updated task{" "}
        <strong>"{activity.details.taskTitle}"</strong>

        <ul
          style={{
            marginTop: "8px",
            paddingLeft: "24px",
            fontSize: "14px",
            color: "#4b5563",
            listStyleType: "disc",
          }}
        >
          {changes.map((change, index) => (
            <li key={index}>
              {change}
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (activity.action === "CREATE_COMMENT") {
    return (
      <>
        {name} commented on task{" "}
        <strong>"{activity.details?.taskTitle}"</strong>
      </>
    );
  }

  if (
    activity.action === "UPDATE_COMMENT" ||
    activity.action === "DELETE_COMMENT"
  ) {
    return (
      <>
        {name} {activity.action === "UPDATE_COMMENT" ? "updated" : "deleted"}  a comment on task{" "}
        <strong>"{activity.details?.taskTitle}"</strong>
      </>
    );
  }

  const actionMap = {
    CREATE_TASK: "created",
    DELETE_TASK: "deleted",

    ASSIGN_TASK: "assigned",

    CREATE_BOARD: "created a board",
    UPDATE_BOARD: "updated a board",
    DELETE_BOARD: "deleted a board",

    CREATE_COMMENT: "commented on a task",
    UPDATE_COMMENT: "updated a comment",
    DELETE_COMMENT: "deleted a comment",

    ACCEPT_INVITATION: "joined the organization",

    UPDATE_USER_ROLE: "changed a user role",
    REMOVE_USER: "removed a user",
  };

  return `${name} ${actionMap[activity.action] || activity.action}`;
}

export default function ActivityFeed({ refreshKey }) {
  const { activeBoard } = useActiveBoard();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivity = async () => {

      if (!activeBoard) return;

      const res = await getActivityFeed(activeBoard?._id);

      setActivities(res.data);

    };

    loadActivity();
  }, [activeBoard, refreshKey]);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h3>Organization Activity Feed</h3>

      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity._id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "10px 0",
            }}
          >
            {formatAction(activity)}

            {activity.action === "ASSIGN_TASK" &&
              activity.details?.taskTitle && (
                <>
                  {" "}
                  <strong>"{activity.details.taskTitle}"</strong>

                  {activity.details?.assignedTo && (
                    <>
                      {" "}
                      to <strong>{activity.details.assignedTo}</strong>
                    </>
                  )}
                </>
              )}

            {activity.details?.commentPreview && (
              <div
                style={{
                  marginTop: "6px",
                  fontStyle: "italic",
                  color: "#666",
                }}
              >
                "{activity.details.commentPreview}"
              </div>
            )}

            <div>
              <small>
                {new Date(activity.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}