import { useGetCommitsQuery } from "./commitsApiSlice"
import Commit from "./Commit"

const CommitsList = () => {
    const {
        data: commits,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCommitsQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = commits

        const tableContent = ids?.length
            ? ids.map(commitId => <Commit key={commitId} commitId={commitId} />)
            : null

        content = (
            <table className="table table--commits">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th commit__status">Username</th>
                        <th scope="col" className="table__th commit__created">Created</th>
                        <th scope="col" className="table__th commit__updated">Updated</th>
                        <th scope="col" className="table__th commit__title">Desc</th>
                        <th scope="col" className="table__th commit__username">Owner</th>
                        <th scope="col" className="table__th commit__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default CommitsList