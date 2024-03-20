import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage: React.FC = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "admin") {
      // Verify the admin key
      const docRef = doc(db, "adminRegister", "8HZYOd68UCqFy5YAGGSG"); // Adjust the document ID
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || docSnap.data()?.key !== adminKey) {
        toast.error("Invalid admin key.");
        return;
      }
    }

    // Firebase signup
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // If the role is admin, store the role in Firestore
      if (role === "admin" && user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          role: "admin",
        });
      }

      toast.success("Signup successful! Redirecting...");
      navigate("/home");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists.");
      } else {
        toast.error(`Signup failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Role
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === "admin" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Admin Key
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Signup
          </button>
        </form>
        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
