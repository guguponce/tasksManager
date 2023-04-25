import { useState } from "react";
import AuthProvider from "./firebase/AuthFirebase";
import Homepage from "./components/Homepage";
import { Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import NewTask from "./components/NewTask";
import FirestoreProvider from "./firebase/Firestore";
import UpdateTask from "./components/UpdateTask";
import SingleTask from "./components/SingleTask";
import TagTasks from "./components/TagTasks";

function App() {
  return (
    <AuthProvider>
      <FirestoreProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/newTask" element={<NewTask />} />
        <Route path="/update/:id" element={<UpdateTask />} />
        <Route path="/task/:id" element={<SingleTask />} />
        <Route path="/:tag" element={<TagTasks />} />

        
      </Routes></FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
