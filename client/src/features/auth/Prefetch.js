import { store } from '../../app/store'
import { commitsApiSlice } from '../commits/commitsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const commits = store.dispatch(commitsApiSlice.endpoints.getCommits.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            commits.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch