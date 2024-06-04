import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetProjectsQuery } from "./projectsApiSlice";
import { useDeleteProjectMutation } from "./projectsApiSlice";
import { memo } from "react";


const Project = ({ projectId }) => {
  const { project } = useGetProjectsQuery("projectsList", {
    selectFromResult: ({ data }) => ({
      project: data?.entities[projectId],
    }),
  });

  // const [
  //   deleteGroup,
  //   { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  // ] = useDeleteGroupMutation();

  const [
    deleteProject,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteProjectMutation();
  const onDeleteProjectClicked = async () => {
    await deleteProject({ id: project.id });
  };

  const navigate = useNavigate();

  if (project) {
    const handleEdit = () => navigate(`/dash/projects/${projectId}`);
   

    return (
      <tr>
        <td>{project.title}</td>
        <td>{project.ownername}</td>
        <td>{project.groupname ? project.groupname : "None" }</td>
        <td>
          <button onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>

        <td>
          <button onClick={onDeleteProjectClicked}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedProject = memo(Project);

export default memoizedProject;
