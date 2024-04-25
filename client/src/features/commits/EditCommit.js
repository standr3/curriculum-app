import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCommitById } from './commitsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditCommitForm from './EditCommitForm'

const EditCommit = () => {
    const { id } = useParams()

    const commit = useSelector(state => selectCommitById(state, id))
    const users = useSelector(selectAllUsers)

    const content = commit && users ? <EditCommitForm commit={commit} users={users} /> : <p>Loading...</p>

    return content
}
export default EditCommit