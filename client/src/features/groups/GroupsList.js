import React, { useState } from "react";
import { useGetGroupsQuery } from "./groupsApiSlice";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetUsersQuery } from "../users/usersApiSlice";

const GroupsList = () => {
  useTitle("Manage Groups");

  //get  users  who are students
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids
        .map((id) => data.entities[id])
        .filter((user) => user.role === "student"),
    }),
  });
  // console.warn("users: ", users);

  const {
    data: groups,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGroupsQuery("groupsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(null);

  const handleGroupClick = (groupId) => {
    const group = groups.entities[groupId];
    setSelectedGroup(group);
    setSelectedStudents(
      group.studentIds.map((studentId) =>
        users.find((user) => user._id === studentId)
      )
    );
  };

  const handleClose = () => {
    setSelectedGroup(null);
    setSelectedStudents(null);
  };

  const addBtn = (
    <Fab
      href="/dash/groups/add"
      color="primary"
      aria-label="add"
      size="small"
      sx={{ mt: "8px",
        float: "right"
    }}
    >
      <AddIcon />
    </Fab>
  );

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = (
      <>
        <p className="errmsg">{error?.data?.message}</p>
        {addBtn}
      </>
    );
  }

  if (isSuccess) {
    const { ids } = groups;

    const tableContent =
      ids?.length &&
      ids.map((groupId) => (
        <TableRow
          key={groupId}
          hover
          onClick={() => handleGroupClick(groupId)}
          sx={{ cursor: "pointer" }}
        >
          <TableCell>{groups.entities[groupId].name}</TableCell>
          <TableCell>
            <Button
              href={`/dash/groups/${groupId}`}
              variant="contained"
              color="primary"
              size="small"
            >
              Edit
            </Button>
          </TableCell>
        </TableRow>
      ));

    content = (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        </TableContainer>
        {addBtn}

        {selectedGroup && (
          <Dialog open={Boolean(selectedGroup)} onClose={handleClose}>
            <DialogTitle>Students in {selectedGroup.name}</DialogTitle>
            <DialogContent>
              <List>
                {selectedStudents.map((student) => (
                  <ListItem key={student._id}>
                    <ListItemText primary={student.username} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return content;
};

export default GroupsList;
