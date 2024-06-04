import { useGetProjectsQuery } from "./projectsApiSlice";
import Project from "./Project";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersApiSlice";

const ProjectsList = () => {
  useTitle("Projects List");

  const { username, isAdmin } = useAuth();

  //get projects
  const {
    data: projects,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProjectsQuery("projectsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // get current user groupId
  const { currentUser } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      currentUser:
        data?.entities[
          data?.ids.find((id) => data?.entities[id].username === username)
        ],
    }),
  });
  console.warn("ProjectsList.js: currentuser :", currentUser);

  let content;
  if (isLoading) content = <PulseLoader color={"#FFF"} />;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (projects && currentUser) {
    console.log("ProjectsList.js: projects:", projects);
    const { ids, entities } = projects;

    let filteredIds;

    filteredIds = ids.filter(
      (projectId) =>
        isAdmin ||
        entities[projectId].ownername === username ||
        (currentUser?.groupId &&
          entities[projectId]?.groupId &&
          entities[projectId]?.groupId === currentUser?.groupId)
    );

    const tableContent =
      ids?.length &&
      filteredIds.map((projectId) => (
        <Project key={projectId} projectId={projectId} />
      ));
    // console.log("ProjectsList.js: tableContent:", tableContent);

    content = (
      <>
        <table>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Owner</th>
              <th scope="col">Group</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dash/projects/add"
        >
          Add Project
        </Button>
      </>
    );
  }

  return content;
};

export default ProjectsList;
