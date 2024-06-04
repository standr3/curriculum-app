import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewProjectMutation } from "./projectsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth  from "../../hooks/useAuth";

const NewProjectForm = ({ users, groups }) => {

    //current user useAuth 
    const { username } = useAuth();
    // console.warn("auth: " + username);


    const [addNewProject, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewProjectMutation();

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [ownerId, setOwnerId] = useState(
        users.find(user => user.username === username)?.id || ''
    );
    const [groupId, setGroupId] = useState(groups[0]?.id || '');

    useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setOwnerId('');
            setGroupId('');
            navigate('/dash/projects');
        }
    }, [isSuccess, navigate]);

    const onTitleChanged = e => setTitle(e.target.value);
    const onOwnerIdChanged1 = e => setOwnerId(e.target.value);
    const onGroupIdChanged = e => setGroupId(e.target.value);

    // const canSave1 = [title, ownerId].every(Boolean) && !isLoading;
    const canSave = [title,ownerId, groupId].every(Boolean) && !isLoading;

    const onSaveProjectClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewProject({ title, ownerId, groupId});
        }
    };

    // const options1 = users.map(user => {
    //     return (
    //         <option
    //             key={user.id}
    //             value={user.id}
    //         >{user.username}</option>
    //     );
    // });

    const options = groups.map(group => {
        return (
            <option
                key={group.id}
                value={group.id}
            >{group.name}</option>
        );
    });

    const errClass = isError ? "errmsg" : "offscreen";
    const validTitleClass = !title ? "form__input--incomplete" : '';

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveProjectClicked}>
                <div className="form__title-row">
                    <h2>New Project</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="groupname">
                    Assigned To Group:
                </label>
                <select
                    id="groupname"
                    name="groupname"
                    className="form__select"
                    value={groupId}
                    onChange={onGroupIdChanged}
                >
                    {options}
                </select>
            </form>
        </>
    );

    return content;
};

export default NewProjectForm;
