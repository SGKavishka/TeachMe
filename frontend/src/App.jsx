import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { About } from "./pages/About.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { BookingConfirmation } from "./pages/BookingConfirmation.jsx";
import { Checkout } from "./pages/Checkout.jsx";
import { Contact } from "./pages/Contact.jsx";
import { DisputeManagement } from "./pages/DisputeManagement.jsx";
import { EarningsDashboard } from "./pages/EarningsDashboard.jsx";
import { FAQ } from "./pages/FAQ.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Messaging } from "./pages/Messaging.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { PaymentFailure } from "./pages/PaymentFailure.jsx";
import { PaymentSuccess } from "./pages/PaymentSuccess.jsx";
import { ReportIssue } from "./pages/ReportIssue.jsx";
import { Register } from "./pages/Register.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { SearchResults } from "./pages/SearchResults.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { TeacherDashboard } from "./pages/TeacherDashboard.jsx";
import { TransactionsPage } from "./pages/TransactionsPage.jsx";
import { TutorListing } from "./pages/TutorListing.jsx";
import { TutorProfile } from "./pages/TutorProfile.jsx";
import { WalletDashboard } from "./pages/WalletDashboard.jsx";

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
          path="/bookings/:id/confirm"
          element={
            <ProtectedRoute roles={["student"]}>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/success/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments/failure"
          element={
            <ProtectedRoute roles={["student"]}>
              <PaymentFailure />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/wallet"
          element={
            <ProtectedRoute roles={["student"]}>
              <WalletDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/transactions"
          element={
            <ProtectedRoute roles={["student"]}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/disputes"
          element={
            <ProtectedRoute roles={["student"]}>
              <DisputeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id/dispute"
          element={
            <ProtectedRoute roles={["student"]}>
              <ReportIssue />
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
          path="/teacher/earnings"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <EarningsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/wallet"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <WalletDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/transactions"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/disputes"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <DisputeManagement />
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
          path="/admin/payments"
          element={
            <ProtectedRoute roles={["admin"]}>
              <WalletDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute roles={["admin"]}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/disputes"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DisputeManagement />
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
