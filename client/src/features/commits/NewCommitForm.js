import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewCommitMutation } from "./commitsApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewCommitForm = ({ users }) => {

    const [addNewCommit, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewCommitMutation()

    const navigate = useNavigate()

    const [desc, setDesc] = useState('')
    // const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0].id)

    useEffect(() => {
        if (isSuccess) {
            setDesc('')
            // setText('')
            setUserId('')
            navigate('/dash/commits')
        }
    }, [isSuccess, navigate])

    const onDescChanged = e => setDesc(e.target.value)
    // const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [desc, userId].every(Boolean) && !isLoading

    const onSaveCommitClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewCommit({ user: userId, desc })
        }
    }

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validDescClass = !desc ? "form__input--incomplete" : ''
    // const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveCommitClicked}>
                <div className="form__title-row">
                    <h2>New Commit</h2>
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
                <label className="form__label" htmlFor="desc">
                    Desc:</label>
                <input
                    className={`form__input ${validDescClass}`}
                    id="desc"
                    name="desc"
                    type="text"
                    autoComplete="off"
                    value={desc}
                    onChange={onDescChanged}
                />

                {/* <label className="form__label" htmlFor="text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                /> */}

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}

export default NewCommitForm