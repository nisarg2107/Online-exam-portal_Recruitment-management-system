import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  redirect,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/admin/dashboard";
import Login from "./components/login";
import Exams from "./components/admin/exams";
import Questions from "./components/admin/questions";
import Categories from "./components/admin/categories";
import AddQuestion from "./components/admin/questions/AddQuestion";
import AddCategory from "./components/admin/categories/AddCategory";
import AddDifficulty from "./components/admin/difficulty/AddDifficulty";
import Difficulty from "./components/admin/difficulty";
import Users from "./components/admin/users";
import AddUser from "./components/admin/users/AddUser";
import Roles from "./components/admin/roles";
import AddRole from "./components/admin/roles/AddRole";
import AddExam from "./components/admin/exams/AddExam";
import ViewUserExams from "./components/admin/users/ViewUserExams";
import AddExamUsers from "./components/admin/exams/AddExamUsers";
import axios from "axios";
import { useEffect, useState } from "react";
import NotFound from "./components/NotFound";
import { checkLogin } from "./utils";
import UserDashboard from "./components/user/dashboard/UserDashboard";
import ViewExamQuestions from "./components/admin/exams/ViewExamQuestions";
import GiveExam from "./components/user/exam/GiveExam";
import ViewUserExamResponse from "./components/admin/user exam response/ViewUserExamResponse";
import ExamDetails from "./components/user/exam/ExamDetails";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const [token, setToken] = useState();

  useEffect(() => {
    checkLogin().then((res) => {
      // console.log('res app', res)

      if (res) {
        const jwt = JSON.parse(localStorage.getItem("jwtToken"));
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (
          userData !== null &&
          userData !== undefined &&
          userData.role.includes("ADMIN")
        ) {
          // window.location.replace('http://localhost:3000/dashboard')
        } else if (
          userData !== null &&
          userData !== undefined &&
          userData.role.includes("USER")
        ) {
          // window.location.replace('http://localhost:3000/userdashboard')
        } else {
          // window.location.replace('http://localhost:3000/login')
        }

        // console.log('jwtttttt', jwt.token)
      }
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/login" element={<Login />} />
          {/* <Route exact path='/' element={<Login />} /> */}
          <Route exact path="/userdashboard" element={<UserDashboard />} />
          <Route exact path="/dashboard" element={<Dashboard />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/dashboard/exams">
              <Route path="/dashboard/exams/view" element={<Exams />} />
              <Route path="/dashboard/exams/add" element={<AddExam />} />
              <Route path="/dashboard/exams/edit" element={<AddExam />} />
              <Route
                path="/dashboard/exams/question"
                element={<ViewExamQuestions />}
              />
              <Route
                path="/dashboard/exams/add/users"
                element={<AddExamUsers />}
              />
            </Route>
            <Route path="/dashboard/roles">
              <Route path="/dashboard/roles/view" element={<Roles />} />
              <Route path="/dashboard/roles/add" element={<AddRole />} />
              <Route path="/dashboard/roles/edit" element={<AddRole />} />
            </Route>
            <Route path="/dashboard/users">
              <Route path="/dashboard/users/view" element={<Users />} />
              <Route path="/dashboard/users/add" element={<AddUser />} />
              <Route path="/dashboard/users/edit" element={<AddUser />} />
              <Route
                path="/dashboard/users/exams"
                element={<ViewUserExams />}
              />
            </Route>
            <Route path="/dashboard/questions">
              <Route path="/dashboard/questions/view" element={<Questions />} />
              <Route
                path="/dashboard/questions/add"
                element={<AddQuestion />}
              />
              <Route
                path="/dashboard/questions/edit"
                element={<AddQuestion />}
              />
            </Route>
            <Route path="/dashboard/categories">
              <Route
                path="/dashboard/categories/view"
                element={<Categories />}
              />
              <Route
                path="/dashboard/categories/add"
                element={<AddCategory />}
              />
              <Route
                path="/dashboard/categories/edit"
                element={<AddCategory />}
              />
            </Route>
            <Route path="/dashboard/difficulty">
              <Route
                path="/dashboard/difficulty/view"
                element={<Difficulty />}
              />
              <Route
                path="/dashboard/difficulty/add"
                element={<AddDifficulty />}
              />
              <Route
                path="/dashboard/difficulty/edit"
                element={<AddDifficulty />}
              />
            </Route>
            <Route
              path="/dashboard/student/:studentId/exam/:examId/response"
              element={<ViewUserExamResponse />}
            />
          </Route>
          <Route
            path="/student/:studentId/exam/:examId"
            element={<GiveExam />}
          />
          <Route
            path="/student/:studentId/exam/:examId/view"
            element={<GiveExam />}
          />
          <Route
            path="/student/:studentId/exam/:examId/info"
            element={<ExamDetails />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Dashboard /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
