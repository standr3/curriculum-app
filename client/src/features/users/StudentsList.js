import React, { useState } from "react";
import { useGetUsersQuery } from "./usersApiSlice";

import PulseLoader from "react-spinners/PulseLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useTitle from "../../hooks/useTitle";

import Student from "./Student";

const StudentsList = () => {
  useTitle("Student List");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserGroupId, setNewUserGroupId] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleDeleteUser = async (userId) => {
    // await deleteUser({ id: userId });
    // refetchUsers();
  };

  const handleAddUser = async () => {
    // await addUser({
    //   username: newUserName,
    //   password: newUserPassword,
    //   role: "student",
    //   groupId: newUserGroupId || null,
    // });
    // setNewUserName("");
    // setNewUserPassword("");
    // setNewUserGroupId("");
    // setIsAddUserDialogOpen(false);
    // refetchUsers();
  };

  const handleOpenAddUserDialog = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsAddUserDialogOpen(false);
  };

  let content;
  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    // console.warn("users-: ", users);
    const { ids, entities } = users;

    const tableContent = ids?.length
      ? ids
          .filter((id) => entities[id].role === "student")
          .map((userId) => (
            <Student
              key={userId}
              userId={userId}
              groupId={entities[userId]?.groupId}
            />
          ))
      : null;

    // const tablerows = users.map((user) => (
    //   <TableRow key={user.id}>
    //     <TableCell>{user.username}</TableCell>
    //     <TableCell>{user.groupId || "N/A"}</TableCell>
    //     <TableCell>
    //       <Button
    //         color="primary"
    //         onClick={() => navigate(`/dash/users/edit/${user._id}`)}
    //       >
    //         Edit
    //       </Button>
    //       <Button color="error" onClick={() => handleDeleteUser(user._id)}>
    //         Delete
    //       </Button>
    //     </TableCell>
    //   </TableRow>
    // ));

    content = (
      <>
        <h1>Students</h1>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          //   onClick={handleOpenAddUserDialog}
          href="/dash/users/add"
          sx={{ mt: 2 }}
        >
          Add Student
        </Button>
        <Dialog open={isAddUserDialogOpen} onClose={handleCloseAddUserDialog}>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Group (optional)"
              type="text"
              fullWidth
              value={newUserGroupId}
              onChange={(e) => setNewUserGroupId(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddUserDialog}>Cancel</Button>
            <Button onClick={handleAddUser}>Add</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return content;
};

export default StudentsList;
