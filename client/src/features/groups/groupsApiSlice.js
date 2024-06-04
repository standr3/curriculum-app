import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const groupsAdapter = createEntityAdapter({});

const initialState = groupsAdapter.getInitialState();

export const groupsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => "/studentGroups",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedGroups = responseData.map((group) => {
          group.id = group._id;
          return group;
        });
        return groupsAdapter.setAll(initialState, loadedGroups);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "StudentGroup", id: "LIST" },
            ...result.ids.map((id) => ({ type: "StudentGroup", id })),
          ];
        } else return [{ type: "StudentGroup", id: "LIST" }];
      },
    }),
    addNewGroup: builder.mutation({
      query: (initialGroupData) => ({
        url: "/studentGroups",
        method: "POST",
        body: {
          ...initialGroupData,
        },
      }),
      invalidatesTags: [{ type: "StudentGroup", id: "LIST" }],
    }),
    updateGroup: builder.mutation({
      query: (initialGroupData) => ({
        url: "/studentGroups",
        method: "PATCH",
        body: {
          ...initialGroupData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "StudentGroup", id: arg.id }],
    }),
    deleteGroup: builder.mutation({
      query: ({ id }) => ({
        url: `/studentGroups`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "StudentGroup", id: arg.id }],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddNewGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApiSlice;

// returns the query result object
export const selectGroupsResult = groupsApiSlice.endpoints.getGroups.select();

// creates memoized selector
const selectGroupsData = createSelector(
  selectGroupsResult,
  (groupsResult) => groupsResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllGroups,
  selectById: selectGroupById,
  selectIds: selectGroupIds,
  // Pass in a selector that returns the groups slice of state
} = groupsAdapter.getSelectors(
  (state) => selectGroupsData(state) ?? initialState
);
