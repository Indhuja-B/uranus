import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Adjust the path
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchQuestion = async () => {
      const questionDoc = await getDoc(doc(db, "questions", id));
      if (questionDoc.exists()) {
        setQuestion(questionDoc.data());
      }
    };

    fetchQuestion();

    // Set up a real-time listener for comments
    const commentsQuery = query(
      collection(db, "questions", id, "comments"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const currentUser = auth.currentUser; // Assuming you've imported auth from Firebase config
    if (!currentUser) return; // Ensure there's a logged-in user

    await addDoc(collection(db, "questions", id, "comments"), {
      text: newComment,
      timestamp: new Date(),
      userEmail: currentUser.email, // Storing the user's email with the comment
    });

    setNewComment("");
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
        <p className="text-gray-700">{question.content}</p>
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="mt-4 rounded-md"
          />
        )}
      </div>

      <div className="mt-8">
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Add a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
          >
            Post Comment
          </button>
        </form>

        {comments.map((comment, index) => (
          <div key={index} className="p-4 bg-white rounded-md shadow-md mb-4">
            <p className="text-gray-700">{comment.text}</p>
            <div className="mt-2 text-sm text-gray-500 flex justify-between">
              <span>By: {comment.userEmail}</span>
              <span>
                {new Date(comment.timestamp?.toDate()).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
