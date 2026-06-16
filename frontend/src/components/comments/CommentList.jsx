import CommentItem from "./CommentItem";

export default function CommentList({ comments, onDelete, onUpdate }) {
  if (!comments.length) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}