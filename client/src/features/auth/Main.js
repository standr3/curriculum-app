import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { Button, Container } from "@mui/material";

const Main = () => {
  // const { username, isTeacher, isAdmin } = useAuth();
  // console.log("Welcome.js: username:", username);
  // console.log("Welcome.js: isTeacher:", isTeacher);
  // console.log("Welcome.js: isAdmin:", isAdmin);
  // useTitle(`techNotes: ${username}`)

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <h1>
        Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!Welcome!
      </h1>
      <p>{today}</p>
      <Button variant="contained" color="primary" component={Link} to="/dash/projects">
        View Projects
      </Button>
      {/* 
            <h1>Welcome {username}!</h1>

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            {(isTeacher || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isTeacher || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>} */}
    </section>
  );

  return content;
};
export default Main;
