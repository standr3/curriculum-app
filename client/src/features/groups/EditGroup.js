import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditGroupForm from "./EditGroupForm";
import { useGetGroupsQuery } from "./groupsApiSlice";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useAddNewUserMutation,
  usersApiSlice,
} from "../users/usersApiSlice";
import { useUpdateGroupMutation } from "./groupsApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../app/api/apiSlice";

const EditGroup = () => {
  useTitle("Edit Group");

  const dispatch = useDispatch();
  //   const { data, refetchD } = useGetPostsQuery({ count: 5 });

  const { id } = useParams();
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const navigate = useNavigate();

  const { group, isLoading: isGroupsLoading } = useGetGroupsQuery(
    "groupsList",
    {
      selectFromResult: ({ data }) => ({
        group: data?.entities[id],
      }),
    }
  );

  const {
    users,
    usersOfGroup,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnMountOrArgChange: true,
    count: 5,
    selectFromResult: ({ data }) => ({
      users: data?.entities,
      usersOfGroup: data?.ids
        .map((id) => data.entities[id])
        .filter((user) => user.groupId === id),
    }),
  });
  console.warn("users: ", users);
  console.warn("usersOfGroup: ", usersOfGroup);
  //   useEffect(() => {
  //     // console.warn("group: ", group);
  //   }, [isUsersLoading]);

  const [
    updateUser,
    {
      isLoading: isUpdatingUser,
      isSuccess: isUserUpdateSuccess,
      isError: isUserUpdateError,
      error: userUpdateError,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (isUserUpdateSuccess) {
      alert("User updated successfully");
      //   refetchD();
      dispatch(
        usersApiSlice.endpoints.getUsers.initiate(
          { count: 5 },
          { subscribe: false, forceRefetch: true }
        )
      );
    }
  }, [isUserUpdateSuccess, navigate]);
  //   useEffect(() => {
  //     alert("Fetching users " + isUsersFetching);
  //   }, [isUsersFetching]);

  //   const [updateUser] = useUpdateUserMutation();
  const [addUser] = useAddNewUserMutation();

  //   const [updateGroup] = useUpdateGroupMutation();

  const handleExcludeUser = async (userId) => {
    // console.warn("entities: ", users.entities);
    const user = users[userId];
    if (user) {
      //   await updateUser({ id: userId, groupId: "" });
      await updateUser({
        id: userId,
        groupId: null,
      });

      //   const updatedGroup = {
      //     ...users[id],
      //     studentIds: users[id].studentIds.filter((id) => id !== userId),
      //   };
      //   await updateGroup({ id, ...updatedGroup });
      refetchUsers();
    }
  };

  const handleAddUser = async () => {
    await addUser({
      username: newUserName,
      password: newUserPassword,
      role: "student",
      groupId: id,
    });
    setNewUserName("");
    setNewUserPassword("");
    setIsAddUserDialogOpen(false);
    refetchUsers();
  };

  const handleOpenAddUserDialog = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsAddUserDialogOpen(false);
  };

  //   console.warn("group: ", group);
  if (isGroupsLoading || isUsersLoading) return <PulseLoader color={"#FFF"} />;

  console.warn("users: ", users);
  if (!group) return <p>Group not found</p>;

  //   const group = users.entities[id];
//   const groupUsers = group.studentIds.map((studentId) => users[studentId]);
  //   console.warn("groupUsers: ", groupUsers);
  return (
    <>
      <EditGroupForm group={group} />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersOfGroup.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleExcludeUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddUserDialog}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserDialog}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditGroup;
