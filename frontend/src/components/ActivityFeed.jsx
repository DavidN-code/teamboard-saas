import { useEffect, useState } from "react";
import { getActivityFeed } from "../api/activityFeed";

function formatAction(action) {
    const actionMap = {
      CREATE_TASK: "created a task",
      UPDATE_TASK: "updated a task",
      DELETE_TASK: "deleted a task",
  
      CREATE_BOARD: "created a board",
      UPDATE_BOARD: "updated a board",
      DELETE_BOARD: "deleted a board",
  
      CREATE_COMMENT: "commented on a task",
      UPDATE_COMMENT: "updated a comment",
      DELETE_COMMENT: "deleted a comment",
  
      CREATE_INVITATION: "invited a team member",
      ACCEPT_INVITATION: "joined the organization",
  
      UPDATE_USER_ROLE: "changed a user role",
      REMOVE_USER: "removed a user",
    };
  
    return actionMap[action] || action;
  }

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivity = async () => {
      const res = await getActivityFeed();
      setActivities(res.data);
    };

    loadActivity();
  }, []);

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
            <strong>
  {activity.userId?.name || "Unknown User"}
</strong>{" "}
{formatAction(activity.action)}

{activity.details?.taskTitle && (
  <>
    {" "}
    <strong>"{activity.details.taskTitle}"</strong>
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
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}