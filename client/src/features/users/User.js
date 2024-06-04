import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

import { TableRow, TableCell, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const User = ({ userId }) => {
  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    //
    const content = (
      <TableRow>
        <TableCell>{user.username}</TableCell>
        <TableCell align="right">{user.role}</TableCell>
        <TableCell align="right">
          {/* <button className="icon-button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button> */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", m: 0, p: 0 }}>
            <IconButton
              size="extra-small"
              edge="start"
              color="primary"
              aria-label="edit row"
              sx={{ m: 0, p: 0, mr: "8px" }}
              onClick={handleEdit}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="extra-small"
              edge="start"
              color="primary"
              aria-label="delete row"
              sx={{ m: 0, p: 0 }}
              // onClick={handleEdit}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    );
    return (
      // <tr className="table__row user">
      //   <td className={"table__cell "}>{user.username}</td>
      //   <td className={"table__cell "}>{user.role}</td>
      //   <td className={"table__cell "}>
      //     <button className="icon-button table__button" onClick={handleEdit}>
      //       <FontAwesomeIcon icon={faPenToSquare} />
      //     </button>
      //   </td>
      // </tr>
      content
    );
  } else return null;
};
export default User;
