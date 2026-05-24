import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { About } from "./pages/About.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { Contact } from "./pages/Contact.jsx";
import { FAQ } from "./pages/FAQ.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Messaging } from "./pages/Messaging.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Register } from "./pages/Register.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { SearchResults } from "./pages/SearchResults.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { TeacherDashboard } from "./pages/TeacherDashboard.jsx";
import { TutorListing } from "./pages/TutorListing.jsx";
import { TutorProfile } from "./pages/TutorProfile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/tutors" element={<TutorListing />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute roles={["student", "teacher", "admin"]}>
              <Messaging />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

