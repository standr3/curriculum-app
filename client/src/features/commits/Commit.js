import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectCommitById } from "./commitsApiSlice";

const Commit = ({ commitId }) => {
  const commit = useSelector((state) => selectCommitById(state, commitId));

  const navigate = useNavigate();

  if (commit) {
    const created = new Date(commit.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(commit.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/commits/${commitId}`);

    return (
      <tr className="table__row">
        <td className="table__cell commit__status">
          {/* {commit.completed ? ( */}
          {true ? (
            <span className="commit__status--completed">Completed</span>
          ) : (
            <span className="commit__status--open">Open</span>
          )}
        </td>
        <td className="table__cell commit__created">{created}</td>
        <td className="table__cell commit__updated">{updated}</td>
        <td className="table__cell commit__title">{commit.desc}</td>
        <td className="table__cell commit__username">{commit.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
export default Commit;
