import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export const nodesApi = createApi({
    reducerPath: 'nodesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    endpoints: (builder) => ({
        getNodes: builder.query({
            query: () => '/nodes',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;

                    socket.on('nodeAdded', (newNode) => {
                        updateCachedData((draft) => {
                            draft.push(newNode);
                        });
                    });

                    socket.on('nodeRemoved', (nodeId) => {
                        updateCachedData((draft) => {
                            return draft.filter(node => node._id !== nodeId);
                        });
                    });

                    await cacheEntryRemoved;
                    socket.off('nodeAdded');
                    socket.off('nodeRemoved');
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        addNode: builder.mutation({
            query: (node) => ({
                url: '/nodes',
                method: 'POST',
                body: node,
            }),
            async onQueryStarted(node, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // The new node will be added through the 'nodeAdded' event
                } catch (error) {
                    console.error('Error adding node:', error);
                }
            },
        }),
        removeNode: builder.mutation({
            query: (nodeId) => ({
                url: `/nodes/${nodeId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(nodeId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // The node will be removed through the 'nodeRemoved' event
                } catch (error) {
                    console.error('Error removing node:', error);
                }
            },
        }),
    }),
});

export const { useGetNodesQuery, useAddNodeMutation, useRemoveNodeMutation } = nodesApi;
