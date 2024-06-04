import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useGetGroupsQuery } from './groupsApiSlice'; // Updated import
import { memo } from 'react';

const Group = ({ groupId }) => { // Updated component name

    const { group } = useGetGroupsQuery("groupsList", { // Updated query hook and argument
        selectFromResult: ({ data }) => ({
            group: data?.entities[groupId] // Updated selector logic
        }),
    });

    const navigate = useNavigate();

    if (group) {
        const handleEdit = () => navigate(`/dash/groups/${groupId}`); // Updated navigation path

        const cellStatus = group.active ? '' : 'table__cell--inactive'; // Assuming groups have an active property

        return (
            <tr className="table__row group"> {/* Updated class name */}
                <td className={`table__cell ${cellStatus}`}>{group.name}</td> {/* Updated property */}
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );

    } else return null;
};

const memoizedGroup = memo(Group); // Updated memoized component name

export default memoizedGroup;
