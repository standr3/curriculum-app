import { useState, useEffect } from "react";
import { useAddNewGroupMutation } from "./groupsApiSlice"; // Updated import
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";

const GROUP_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;

const NewGroup = () => {
  useTitle("Create New Group"); // Updated title

  const [addNewGroup, { isLoading, isSuccess, isError, error }] =
    useAddNewGroupMutation(); // Updated mutation

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);

  useEffect(() => {
    setValidName(GROUP_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    if (isSuccess) {
      setName("");
      navigate("/dash/groups"); // Updated navigation path
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);

  const canSave = [validName].every(Boolean) && !isLoading;

  const onSaveGroupClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewGroup({ name });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validNameClass = !validName ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveGroupClicked}>
        <div className="form__title-row">
          <h2>New Group</h2> {/* Updated title */}
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="name">
          Group Name: <span className="nowrap">[3-20 letters]</span>
        </label>{" "}
        {/* Updated label */}
        <input
          className={`form__input ${validNameClass}`}
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewGroup; // Updated export
