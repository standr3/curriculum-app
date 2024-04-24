import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const commitsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = commitsAdapter.getInitialState()

export const commitsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCommits: builder.query({
            query: () => '/commits',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedCommits = responseData.map(commit => {
                    commit.id = commit._id
                    return commit
                });
                return commitsAdapter.setAll(initialState, loadedCommits)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Commit', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Commit', id }))
                    ]
                } else return [{ type: 'Commit', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetCommitsQuery,
} = commitsApiSlice

// returns the query result object
export const selectCommitsResult = commitsApiSlice.endpoints.getCommits.select()

// creates memoized selector
const selectCommitsData = createSelector(
    selectCommitsResult,
    commitsResult => commitsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCommits,
    selectById: selectCommitById,
    selectIds: selectCommitIds
    // Pass in a selector that returns the commits slice of state
} = commitsAdapter.getSelectors(state => selectCommitsData(state) ?? initialState)