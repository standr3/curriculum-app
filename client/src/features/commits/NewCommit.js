import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewCommitForm from "./NewCommitForm";

const NewCommit = () => {
  const users = useSelector(selectAllUsers);

  if (!users?.length) return <p>Not Currently Available</p>;

  const content = <NewCommitForm users={users} />;

  return content;
};
export default NewCommit;
