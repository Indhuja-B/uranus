import React, { useEffect, useState } from "react";
import { db, storage } from "../firebaseConfig"; // Adjust the path
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const ForumPage: React.FC = () => {
  return (
    <div className="p-4">
      <NewQuestionForm />
      <QuestionsList />
    </div>
  );
};

const NewQuestionForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    let imageUrl = "";
    if (image) {
      const storageRef = ref(storage, "forum-images/" + image.name);
      await uploadBytes(storageRef, image);
      imageUrl = storageRef.fullPath;
    }

    // Add question to Firestore
    const questionData = {
      content: question,
      image: imageUrl,
      comments: [],
      timestamp: new Date(),
    };
    await addDoc(collection(db, "questions"), questionData);

    // Reset form
    setQuestion("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
        placeholder="Ask a new question..."
      />
      <input type="file" onChange={handleImageChange} className="mb-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Post Question
      </button>
    </form>
  );
};

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsData);
    };

    fetchQuestions();
  }, []);

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionItem key={question.id} data={question} />
      ))}
    </div>
  );
};

const QuestionItem: React.FC<{ data: any }> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border p-4 rounded-md"
      onClick={() => setExpanded(!expanded)}
    >
      <p className="mb-2">{data.content}</p>
      {data.image && <img src={data.image} alt="Question" className="mb-2" />}
      {expanded && <CommentsSection comments={data.comments} />}
    </div>
  );
};

const CommentsSection: React.FC<{ comments: any[] }> = ({ comments }) => {
  return (
    <div className="mt-4 space-y-2">
      {comments.map((comment, index) => (
        <p key={index} className="border-t pt-2">
          {comment}
        </p>
      ))}
      {/* Add a form or input here to post new comments */}
    </div>
  );
};

export default ForumPage;
