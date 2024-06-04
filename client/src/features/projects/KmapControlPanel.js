import React, { useEffect, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import {
  faThumbsUp,
  faThumbsDown,
  faLink,
  faPen,
  faTrash,
  faArrowRight,
  faArrowLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { index } from "d3";

const captialize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const NodeController = ({ data, handlers }) => {
  const [currNode, setCurrNode] = useState(null);
  const [currTask, setCurrTask] = useState(null);

  const handleRename = (e) => {
    e.preventDefault();
    let newDatum;

    const newTitle = e.target.title.value;
    const node = data.state.nodes.find((n) => n.name === currNode.name);
    if (node) {
      const newNode = { ...node, name: newTitle };
      const newNodes = data.state.nodes.map((n) =>
        n.id === node.id ? newNode : n
      );

      const newLinks = data.state.links.map((l) => {
        if (l.source.id === node.id) {
          return { ...l, source: newNode };
        } else if (l.target.id === node.id) {
          return { ...l, target: newNode };
        }
        return l;
      });

      data.setState({ nodes: newNodes, links: newLinks });
      handlers.syncNeeded.setState(true);
      newDatum = { ...currNode, name: newTitle };
      //   setCurrNode(newDatum);
    }
    const newTask = "inspect";
    handlers.switchControlMode("node", newTask, newDatum);
  };
  const handleEdit = (e) => {
    e.preventDefault();
    let newDatum;

    const newTitle = e.target.title.value;
    const newHours = e.target.hours.value;
    const newPriority = e.target.priority.value;

    // alert(newTitle + " " + newHours + " " + newPriority);

    const node = data.state.nodes.find((n) => n.name === currNode.name);
    if (node) {
      const newNode = {
        ...node,
        name: newTitle,
        hours: newHours,
        priority: newPriority,
      };

      const newNodes = data.state.nodes.map((n) =>
        n.id === node.id ? newNode : n
      );

      const newLinks = data.state.links.map((l) => {
        if (l.source.id === node.id) {
          return { ...l, source: newNode };
        } else if (l.target.id === node.id) {
          return { ...l, target: newNode };
        }
        return l;
      });

      data.setState({ nodes: newNodes, links: newLinks });
      handlers.syncNeeded.setState(true);
      newDatum = {
        ...currNode,
        name: newTitle,
        hours: newHours,
        priority: newPriority,
      };
    }
    const newTask = "inspect";
    handlers.switchControlMode("node", newTask, newDatum);
  };
  const handleCreate = (e) => {
    e.preventDefault();
    const newTitle = e.target.title.value;
    // check if node already exists
    const node = data.state.nodes.find((n) => n.name === newTitle);
    if (node) {
      alert("Node already exists");
      return;
    }

    const newHours = e.target.hours.value;
    const newPriority = e.target.priority.value;
    const newDatum = {
      id: Math.random().toString(36).substring(7),
      index: data.state.nodes.length,
      name: newTitle,
      hours: newHours,
      priority: newPriority,
    };

    const newNodes = [...data.state.nodes, newDatum];
    data.setState({ nodes: newNodes, links: data.state.links });
    handlers.syncNeeded.setState(true);
    const newTask = "inspect";
    handlers.switchControlMode("node", newTask, newDatum);
  };

  useEffect(() => {
    if (handlers.ctrlMode?.state?.subject === "node") {
      setCurrNode(handlers.focusedNode?.state); // datum object
      setCurrTask(handlers.ctrlMode?.state?.action); // inspect, edit, rename
    }
  }, [handlers.ctrlMode, handlers.focusedNode]);

  return (
    <>
      {currNode && (
        <>
          <Card className="card--shadow " bgColor="#fff0e5">
            <div className="card__content panel-node">
              <h4 className="card__row panel-node__header">
                {currTask === "create"
                  ? "Create new node"
                  : captialize(currTask) + " node " + currNode.name}
              </h4>
              {currTask === "inspect" && (
                <>
                  <div className="card__row panel-node__info ">
                    <span>Time: {currNode.hours}h</span>
                    <span>Priority: {currNode.priority}</span>
                  </div>
                  <div className="card__row panel-node__menu">
                    <Button
                      content={faThumbsUp}
                      className="btn-icon panel-node__menu__btn--disabled"
                    />
                    <Button
                      content={faThumbsDown}
                      className="btn-icon panel-node__menu__btn--disabled"
                    />
                    <Button
                      content={faLink}
                      className="btn-icon panel-node__menu__btn"
                      onClick={() => {
                        handlers.switchControlMode("node", "links", currNode);
                      }}
                    />
                    <Button
                      content={faPen}
                      className="btn-icon panel-node__menu__btn"
                      onClick={() => {
                        handlers.switchControlMode("node", "edit", currNode);
                      }}
                    />
                    <Button
                      content={faTrash}
                      className="btn-icon panel-node__menu__btn"
                      onClick={() => {
                        handlers.switchControlMode("node", "delete", currNode);
                      }}
                    />
                  </div>
                </>
              )}

              {currTask === "links" && (
                <div className="panel-node__links">
                  <h4>Links</h4>
                  <ul>
                    {data.state.links.map((l) => {
                      if (l.source.id === currNode.id) {
                        return (
                          <li
                            key={l.id}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <span>{l.target.name} &nbsp; </span>
                            <Button
                              content={faArrowRight}
                              className="btn-icon"
                              onClick={() => {
                                handlers.switchControlMode("link", "switch", {
                                  id: l.id,
                                  focused: currNode,
                                });
                              }}
                            />
                            <span>
                              {" "}
                              &nbsp; {l.category}
                              {l.label && "::" + l.label}
                            </span>
                            <Button
                              content={faEdit}
                              className="btn-icon"
                              onClick={() => {
                                handlers.switchControlMode("link", "edit", {
                                  index: l.index,
                                  id: l.id,
                                  category: l.category,
                                  label: l.label ? l.label : null,
                                  source: l.source,
                                  target: l.target,
                                });
                              }}
                            />
                          </li>
                        );
                      } else if (l.target.id === currNode.id) {
                        return (
                          <li
                            key={l.id}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <span>{l.source.name} &nbsp; </span>
                            <Button
                              content={faArrowLeft}
                              className="btn-icon"
                              onClick={() => {
                                handlers.switchControlMode("link", "switch", {
                                  id: l.id,
                                  focused: currNode,
                                });
                              }}
                            />
                            <span>
                              {" "}
                              &nbsp; {l.category}
                              {l.label && "::" + l.label}
                            </span>
                            <Button
                              content={faEdit}
                              className="btn-icon"
                              onClick={() => {
                                handlers.switchControlMode("link", "edit", {
                                  index: l.index,
                                  id: l.id,
                                  category: l.category,
                                  label: l.label ? l.label : null,
                                  source: l.source,
                                  target: l.target,
                                });
                              }}
                            />
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}

              {currTask === "rename" && (
                <form className="panel-node__form" onSubmit={handleRename}>
                  <div className="panel-node__form__row">
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                      defaultValue={currNode.name}
                    />
                  </div>
                </form>
              )}
              {currTask === "edit" && (
                <form className="panel-node__form" onSubmit={handleEdit}>
                  <div className="panel-node__form__row">
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                      defaultValue={currNode.name}
                    />
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="hours">Time: </label>
                    <input
                      type="number"
                      id="hours"
                      name="hours"
                      autoComplete="off"
                      spellCheck="false"
                      min={0}
                      defaultValue={currNode.hours}
                    />
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="priority">Priority: </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="low"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="low"
                        value="-1"
                      />
                      <span style={{ color: "#3AB34A" }}>low</span>
                    </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="medium"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="medium"
                        value="0"
                        defaultChecked="checked"
                      />
                      <span style={{ color: "#F8EB10" }}>medium</span>
                    </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="high"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="high"
                        value="1"
                      />
                      <span style={{ color: "#E91720" }}>high</span>
                    </label>
                  </div>

                  <button className="btn-text" type="submit">
                    Save
                  </button>
                </form>
              )}
              {currTask === "create" && (
                <form className="panel-node__form" onSubmit={handleCreate}>
                  <div className="panel-node__form__row">
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                      defaultValue={currNode.name}
                    />
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="hours">Time: </label>
                    <input
                      type="number"
                      id="hours"
                      name="hours"
                      autoComplete="off"
                      spellCheck="false"
                      min={0}
                      defaultValue={currNode.hours}
                    />
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="priority">Priority: </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="low"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="low"
                        value="-1"
                      />
                      <span style={{ color: "#3AB34A" }}>low</span>
                    </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="medium"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="medium"
                        value="0"
                        defaultChecked="checked"
                      />
                      <span style={{ color: "#F8EB10" }}>medium</span>
                    </label>

                    <label
                      className="panel-node__form__row__levels__item"
                      htmlFor="high"
                    >
                      <input
                        className="radio"
                        type="radio"
                        name="priority"
                        id="high"
                        value="1"
                      />
                      <span style={{ color: "#E91720" }}>high</span>
                    </label>
                  </div>

                  <button className="btn-text" type="submit">
                    Create
                  </button>
                </form>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
};

const LinkController = ({ data, handlers }) => {
  const [currLink, setCurrLink] = useState(null);
  const [currTask, setCurrTask] = useState(null);

  const handleEdit = (e) => {
    e.preventDefault();

    const newCategory = e.target.category.value;
    const newLabel = e.target.label.value || null;
    const newSource = e.target.source.value;
    const newTarget = e.target.target.value;

    if (newSource === newTarget) {
      alert("Source and target cannot be the same");
      return;
    }

    const link = data.state.links.find((l) => l.id === currLink.id);
    if (link) {
      const newLink = {
        ...link,
        category: newCategory,
        label: newLabel,
        source: data.state.nodes.find((n) => n.id === newSource),
        target: data.state.nodes.find((n) => n.id === newTarget),
      };

      const newLinks = data.state.links.map((l) =>
        l.id === link.id ? newLink : l
      );

      data.setState({ nodes: data.state.nodes, links: newLinks });
      handlers.syncNeeded.setState(true);
      setCurrLink(newLink);
    }
    const newTask = "inspect";
    handlers.switchControlMode("link", newTask, currLink);
  };

  useEffect(() => {
    if (handlers.ctrlMode?.state?.subject === "link") {
      setCurrLink(handlers.focusedLink?.state); // datum object
      setCurrTask(handlers.ctrlMode?.state?.action); // inspect, edit
    }
  }, [handlers.ctrlMode, handlers.focusedLink]);

  return (
    <>
      {currLink && (
        <>
          <Card className="card--shadow " bgColor="#fff0e5">
            <div className="card__content panel-node">
              <h4 className="card__row panel-node__header">
                {currTask === "create"
                  ? "Create new link"
                  : captialize(currTask) +
                    " link " +
                    currLink.source.name +
                    " -> " +
                    currLink.target.name}
              </h4>
              {currTask === "create" && (
                <div>
                  {handlers.sourceNode.state ? (
                    <>
                      <span>Source Node: {handlers.sourceNode.state}</span>
                      <button
                        onClick={() => {
                          handlers.sourceNode.setState(null);
                        }}
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <p className="color-change">Click on the source node</p>
                  )}
                  {handlers.targetNode.state ? (
                    <>
                      <span>Target Node: {handlers.targetNode.state}</span>
                      <button
                        onClick={() => {
                          handlers.targetNode.setState(null);
                        }}
                      >
                        X
                      </button>
                    </>
                  ) : (
                    handlers.sourceNode.state && (
                      <p className="color-change">Click on the target node</p>
                    )
                  )}

                  {handlers.sourceNode.state && handlers.targetNode.state && (
                    <div>
                      {handlers.sourceNode.state ===
                      handlers.targetNode.state ? (
                        <p>Source and target cannot be the same</p>
                      ) : data.state.links.find(
                          (l) =>
                            l.source.name === handlers.sourceNode.state &&
                            l.target.name === handlers.targetNode.state
                        ) ? (
                        <p className="warning">
                          Source and target are already linked!
                        </p>
                      ) : data.state.links.find(
                          (l) =>
                            l.source.name === handlers.targetNode.state &&
                            l.target.name === handlers.sourceNode.state
                        ) ? (
                        <p className="warning">
                          Source and target are already linked!
                        </p>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            // action({ type: "ADD_LINK", payload: { source: sourceNode, target: targetNode, category: e.target.category.value, label: e.target.label.value } })
                            // console.log("add link");
                            // alert("select source node");
                            const index = data.state.links.length;
                            const id = Math.random().toString(36).substr(2, 9);
                            const category = e.target.category.value;
                            const label = e.target.label.value || null;

                            const newLink = {
                              index: index,
                              id: id,
                              category: category,
                              label: label,
                              source: data.state.nodes.find(
                                (n) => n.name === handlers.sourceNode.state
                              ),
                              target: data.state.nodes.find(
                                (n) => n.name === handlers.targetNode.state
                              ),
                            };

                            const newLinks = [...data.state.links, newLink];
                            data.setState({
                              nodes: data.state.nodes,
                              links: newLinks,
                            });
                            handlers.syncNeeded.setState(true);
                            handlers.switchControlMode(
                              "link",
                              "inspect",
                              newLink
                            );
                            handlers.sourceNode.setState(null);
                            handlers.targetNode.setState(null);
                          }}
                        >
                          <div className="input-container">
                            <select name="category">
                              <option value="REQ">REQ</option>
                              <option value="IMP">IMP</option>
                              <option value="OPT">OPT</option>
                            </select>
                          </div>
                          <div className="input-container">
                            <input
                              type="text"
                              name="label"
                              placeholder="Label"
                            />
                          </div>
                          <button type="submit">Add Link</button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currTask === "inspect" && (
                <>
                  <div className="card__row panel-node__info ">
                    <span>Category: {currLink.category}</span>
                    <span>Label: {currLink.label}</span>
                  </div>
                  <div className="card__row panel-node__menu">
                    <Button
                      content={faThumbsUp}
                      className="btn-icon panel-node__menu__btn--disabled"
                    />
                    <Button
                      content={faThumbsDown}
                      className="btn-icon panel-node__menu__btn--disabled"
                    />
                    <Button
                      content={faPen}
                      className="btn-icon panel-node__menu__btn"
                      onClick={() => {
                        handlers.switchControlMode("link", "edit", currLink);
                      }}
                    />
                    <Button
                      content={faTrash}
                      className="btn-icon panel-node__menu__btn"
                      onClick={() => {
                        handlers.switchControlMode("link", "delete", currLink);
                      }}
                    />
                  </div>
                </>
              )}

              {currTask === "edit" && (
                <form className="panel-node__form" onSubmit={handleEdit}>
                  <div className="panel-node__form__row">
                    <label htmlFor="category">Category:</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                      defaultValue={currLink.category}
                    />
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="label">Label: </label>
                    <input
                      type="text"
                      id="label"
                      name="label"
                      autoComplete="off"
                      spellCheck="false"
                      defaultValue={currLink.label}
                    />
                  </div>
                  {/* select menu for target and source */}
                  <div className="panel-node__form__row">
                    <label htmlFor="source">Source: </label>
                    <select
                      id="source"
                      name="source"
                      defaultValue={currLink.source.id}
                    >
                      {data.state.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="panel-node__form__row">
                    <label htmlFor="target">Target: </label>
                    <select
                      id="target"
                      name="target"
                      defaultValue={currLink.target.id}
                    >
                      {data.state.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="btn-text" type="submit">
                    Save
                  </button>
                </form>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
};
const KmapControlPanel = ({ data, handlers }) => {
  const show = handlers.ctrlMode.state;

  return (
    <>
      {show ? (
        <div className="panel top-right">
          {handlers.ctrlMode?.state?.subject === "node" ? (
            <NodeController data={data} handlers={handlers} />
          ) : (
            <LinkController data={data} handlers={handlers} />
          )}
        </div>
      ) : null}
    </>
  );
};

export default KmapControlPanel;
