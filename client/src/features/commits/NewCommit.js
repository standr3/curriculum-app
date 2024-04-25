import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewCommitForm from './NewCommitForm'

const NewCommit = () => {
    const users = useSelector(selectAllUsers)

    const content = users ? <NewCommitForm users={users} /> : <p>Loading...</p>

    return content
}
export default NewCommit