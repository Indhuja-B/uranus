import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig"; // Adjust the path
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ForumPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

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
    <div className="p-4 space-y-6">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Ask a New Question
      </button>
      {showModal && <NewQuestionForm onClose={() => setShowModal(false)} />}
      <div className="space-y-4">
        {questions.map((question) => (
          <Link
            key={question.id}
            to={`/question/${question.id}`}
            className="block bg-white p-4 rounded-lg shadow-md hover:bg-gray-100"
          >
            {question.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NewQuestionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
      imageUrl = await getDownloadURL(storageRef); // Get the download URL
    }

    // Add question to Firestore
    const questionData = {
      title: title,
      content: content,
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-md z-10 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Ask a New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Your question..."
            rows={4}
          />
          <div className="flex items-center space-x-4">
            <input type="file" onChange={handleImageChange} />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumPage;
