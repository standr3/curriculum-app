import NewProjectForm from "./NewProjectForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetGroupsQuery } from "../groups/groupsApiSlice";

import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const NewProject = () => {
  useTitle("Create New Project");

  console.warn("NewProject.js: NewProject()");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });
  const { groups } = useGetGroupsQuery("groupsList", {
    selectFromResult: ({ data }) => ({
      groups: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length || !groups?.length) return <PulseLoader color={"#FFF"} />;

  // const content1 = <NewProjectForm users={users} />;

  const content = <NewProjectForm users={users} groups={groups} />;

  return content;
};
export default NewProject;
