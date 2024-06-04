import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isStudent = false;
  let isTeacher = false;
  let isAdmin = false;
  let status = "student";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, userId, role} = decoded.UserInfo;

    isStudent = role === "student";
    isTeacher = role === "teacher";
    isAdmin = role === "admin";

    if (isStudent) status = "Student";
    if (isTeacher) status = "Teacher";
    if (isAdmin) status = "Admin";

    return { username, userId, role, status, isStudent, isTeacher, isAdmin };
  }

  return { username: "", userId: "", role: "", isStudent, isTeacher, isAdmin, status };
};
export default useAuth;
