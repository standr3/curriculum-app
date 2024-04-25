import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import CommitsList from "./features/commits/CommitsList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditCommit from "./features/commits/EditCommit";
import NewCommit from "./features/commits/NewCommit";
import Prefetch from "./features/auth/Prefetch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<Prefetch />}>
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />

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
          {/* End Dash */}
        </Route>
        {/* End Prefetch */}
      </Route>
    </Routes>
  );
}

export default App;
