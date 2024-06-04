import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

import { TableRow, TableCell, Button } from "@mui/material";
import { useGetGroupsQuery } from "../groups/groupsApiSlice";

const Teacher = ({ userId}) => {
  const user = useSelector((state) => selectUserById(state, userId));

//   const { group } = useGetGroupsQuery("groupsList", {
//     selectFromResult: ({ data }) => ({
//       group: data?.entities[groupId],
//     }),
//   });

//   console.warn(`group: ${groupId}`, group);

//   const groupname = group ? group.name : null;

  const navigate = useNavigate();

  if (!user ) {
    return null;
  }

  if (user) {
    // const handleEdit = () => navigate(`/dash/users/${userId}`);

    //
    const content = (
      <TableRow>
        <TableCell>{user.username}</TableCell>
        {/* <TableCell>{groupname || "N/A"}</TableCell> */}
        <TableCell>
          <Button
            color="primary"
            onClick={() => navigate(`/dash/users/${user._id}`)}
          >
            Edit
          </Button>
          <Button color="error">Delete</Button>
        </TableCell>
      </TableRow>
    );
    return content;
  } else return null;
};
export default Teacher;
