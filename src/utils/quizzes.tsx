import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const QuizzesPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isQuizOverlayOpen, setIsQuizOverlayOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ]);
  const [quizTitle, setQuizTitle] = useState<string>("");

  const [quizzes, setQuizzes] = useState<any[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ]);
  };

  const openQuizOverlay = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsQuizOverlayOpen(true);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = () => {
    let score = 0;
    selectedQuiz.questions.forEach((question: any, index: number) => {
      if (question.correctAnswer === userAnswers[index]) {
        score += 5;
      }
    });
    alert(`Your score is: ${score} points!`);
    setIsQuizOverlayOpen(false);
  };

  const saveQuizToDatabase = async () => {
    try {
      const newQuiz = {
        title: quizTitle,
        createdBy: auth.currentUser?.email,
        timestamp: new Date(),
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctOption,
        })),
      };

      await addDoc(collection(db, "quizzes"), newQuiz);

      setQuestions([
        {
          questionText: "",
          options: ["", "", "", ""],
          correctOption: 0,
        },
      ]);
      setQuizTitle("");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const userUID = auth.currentUser.uid;
        const userRef = doc(db, "users", userUID);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData?.role || null);
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(fetchedQuizzes);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
        {role === "admin" && (
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
          >
            Create Quiz
          </button>
        )}
      </div>
      <div className="mt-8">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-4 border rounded-md mb-4 cursor-pointer hover:bg-gray-100"
            onClick={() => openQuizOverlay(quiz)}
          >
            <h3 className="text-xl font-semibold">{quiz.title}</h3>
            <p className="text-sm text-gray-500">
              Created by: {quiz.createdBy}
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(quiz.timestamp?.toDate()).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {isQuizOverlayOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-md z-10 space-y-4 w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{selectedQuiz?.title}</h2>
              <button
                onClick={() => setIsQuizOverlayOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto flex-1 max-h-[55vh]">
              {selectedQuiz?.questions.map((question: any, qIndex: number) => (
                <div key={qIndex} className="space-y-4 border-b pb-4 mb-4">
                  <p className="text-lg font-medium">{question.questionText}</p>
                  {question.options.map((option: string, oIndex: number) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        checked={userAnswers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                      />
                      <label className="w-full p-2 border rounded-md cursor-pointer hover:bg-gray-100">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={submitQuiz}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-md z-10 space-y-4 w-3/4 max-h-[90vh] ">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">Create a New Quiz</h2>
              <button
                onClick={() => {
                  setQuestions([
                    {
                      questionText: "",
                      options: ["", "", "", ""],
                      correctOption: 0,
                    },
                  ]);
                  setQuizTitle("");
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mb-4"
              >
                Close
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="quizTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Quiz Title
              </label>
              <input
                type="text"
                id="quizTitle"
                name="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter the quiz title"
              />
            </div>
            <div className="overflow-y-auto flex-1 max-h-[55vh]">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-2">
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].questionText = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full p-3 border rounded-md"
                    placeholder={`Question ${qIndex + 1}`}
                  />
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={q.correctOption === oIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].correctOption = oIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[qIndex].options[oIndex] = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="w-full p-2 border rounded-md"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Another Question
            </button>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              style={{ marginLeft: "10px" }}
              onClick={saveQuizToDatabase}
            >
              Save Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
