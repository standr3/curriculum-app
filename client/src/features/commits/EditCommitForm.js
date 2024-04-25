import { useState, useEffect } from "react";
import {
  useUpdateCommitMutation,
  useDeleteCommitMutation,
} from "./commitsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditCommitForm = ({ commit, users }) => {
  const [updateCommit, { isLoading, isSuccess, isError, error }] =
    useUpdateCommitMutation();

  const [
    deleteCommit,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCommitMutation();

  const navigate = useNavigate();

  const [desc, setDesc] = useState(commit.title);
  // const [text, setText] = useState(commit.text)
  // const [completed, setCompleted] = useState(commit.completed)
  const [userId, setUserId] = useState(commit.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setDesc("");
      // setText('')
      setUserId("");
      navigate("/dash/commits");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onDescChanged = (e) => setDesc(e.target.value);
  // const onTextChanged = e => setText(e.target.value)
  // const onCompletedChanged = e => setCompleted(prev => !prev)
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [desc, userId].every(Boolean) && !isLoading;

  const onSaveCommitClicked = async (e) => {
    if (canSave) {
      await updateCommit({ id: commit.id, user: userId, desc });
    }
  };

  const onDeleteCommitClicked = async () => {
    await deleteCommit({ id: commit.id });
  };

  const created = new Date(commit.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(commit.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validDescClass = !desc ? "form__input--incomplete" : "";
  // const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__desc-row">
          <h2>Edit Commit #{commit.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveCommitClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteCommitClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="commit-desc">
          Desc:
        </label>
        <input
          className={`form__input ${validDescClass}`}
          id="commit-desc"
          name="desc"
          type="text"
          autoComplete="off"
          value={desc}
          onChange={onDescChanged}
        />

        {/* <label className="form__label" htmlFor="commit-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="commit-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        /> */}
        <div className="form__row">
          <div className="form__divider">
            {/* <label
              className="form__label form__checkbox-container"
              htmlFor="commit-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="commit-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label> */}

            <label
              className="form__label form__checkbox-container"
              htmlFor="commit-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="commit-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditCommitForm;
