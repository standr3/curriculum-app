import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./components/Login";
import AdminLogin from "./features/auth/AdminLogin";
import Register from "./components/Register";

import DashLayout from "./components/DashLayout";
import Main from "./features/auth/Main";
import CommitsList from "./features/commits/CommitsList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditCommit from "./features/commits/EditCommit";
import NewCommit from "./features/commits/NewCommit";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import DashBoard from "./components/DashBoard";
import ProjectsList from "./features/projects/ProjectsList";
import Map from "./components/Map";
import NewProject from "./features/projects/NewProject";
import EditProject from "./features/projects/EditProject";
import KMap from "./features/projects/KMap";

import GroupsList from "./features/groups/GroupsList";
import EditGroup from "./features/groups/EditGroup";
import NewGroup from "./features/groups/NewGroup";
import StudentsList from "./features/users/StudentsList";
import TeachersList from "./features/users/TeachersList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="account">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Main />} />

              <Route path="projects">
                <Route index element={<ProjectsList />} />
                <Route path=":id" element={<EditProject />} />
                <Route path="view" element={<KMap />} />
                <Route path="add" element={<NewProject />} />
              </Route>

              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="teachers" element={<TeachersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="add" element={<NewUserForm />} />
              </Route>

              <Route path="groups">
                <Route index element={<GroupsList />} />
                <Route path=":id" element={<EditGroup />} />
                <Route path="add" element={<NewGroup />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

{
  /* <Route
          exact
          path="m"
          element={
            <Navigate to={`/m/${Math.floor(Math.random() * 100)}`} replace />
          }
        />
        <Route path="m/:id" element={<Map />} />

        <Route path="login">
          <Route index element={<Login />} />
          <Route path="admin" element={<AdminLogin />} />
        </Route>
        <Route path="register">
          <Route index element={<Register />} />
          <Route path="student" element={<StudentRegister />} />
          <Route path="teacher" element={<TeacherRegister />} />
        </Route>

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            */
}

{
  /* <Route path="dash" element={<DashLayout />}>
              <Route index element={<Main />} />

              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUserForm />} />
              </Route>

              <Route path="commits">
                <Route index element={<CommitsList />} />
                <Route path=":id" element={<EditCommit />} />
                <Route path="new" element={<NewCommit />} />
              </Route>
            </Route>
          </Route>
        </Route>  */
}
