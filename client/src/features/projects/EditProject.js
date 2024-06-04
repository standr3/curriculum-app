import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "./projectsApiSlice";
import KMap from "./KMap";
import PulseLoader from "react-spinners/PulseLoader";
import { index, link } from "d3";

function logPercentage(votes, totalVotes=20) {
  // Validate inputs
  if (votes < 0 || totalVotes <= 0 || votes > totalVotes) {
    throw new Error(
      "Invalid input values. Ensure votes >= 0, totalVotes > 0, and votes <= totalVotes."
    );
  }

  // Calculate the percentage of votes
  const percentage = votes / totalVotes;

  // Define the base of the logarithm and the scaling factor
  const base = Math.E; // Using natural logarithm
  const scalingFactor = 0.99 / Math.log(1 + totalVotes);

  // Calculate the logarithmic value based on the percentage of votes
  const logValue = scalingFactor * Math.log(1 + percentage * totalVotes);

  // Ensure the value is between 0 and 0.99
  return Math.min(Math.max(logValue, 0), 0.99).toFixed(2);
}
function expPercentage(votes, totalVotes=3) {
  // Validate inputs
  if (votes < 0 || totalVotes <= 0 || votes > totalVotes) {
      throw new Error('Invalid input values. Ensure votes >= 0, totalVotes > 0, and votes <= totalVotes.');
  }

  // Calculate the percentage of votes
  const percentage = votes / totalVotes;

  // Define the base of the exponential function and the scaling factor
  const base = 2; // Using base 2 for the exponential function
  const scalingFactor = 0.99;

  // Calculate the exponential value based on the percentage of votes
  const expValue = scalingFactor * (Math.pow(base, percentage) - 1) / (base - 1);

  // Ensure the value is between 0 and 0.99
  return Math.min(Math.max(expValue, 0), 0.99).toFixed(2);
}

const EditProject = () => {
  const [trgId, setTrgId] = useState();
  const [srcId, setSrcId] = useState();
  const handleTrgIdChange = (e) => setTrgId(e.target.value);
  const handleSrcIdChange = (e) => setSrcId(e.target.value);

  const [commits, setCommits] = useState([
    // "s1:n:add:Root",
    // "s1:n:add:Node1",
    // "s1:n:add:Node2",
    // "s2:n:add:Node1",
    // "s3:n:rmv:Node2",
    // "s2:l:add:Node1:Node2",
    
  ]);

  const { nodesCommited, linksCommited } = commits.reduce(
    (acc, commit) => {
      const [guest, element, cmd, arg1, arg2] = commit.split(":");
      if (element === "n" && cmd === "add") {
        acc.nodesCommited.push({
          // index: arg1,
          id: arg1,
          name: arg1,
          hours: 0,
          priority: 0,
          popularity: 0,
          by: "guest",
        });
      } else if (element === "l" && cmd === "add") {
        acc.linksCommited.push({
          // index: arg1 + arg2, 
          id: arg1 + arg2,
          source: arg1,
          target: arg2,
          category: "REQ",
          label: "null",
          popularity: 0,
          by: "guest",
         });
      }
      return acc;
    },
    { nodesCommited: [], linksCommited: [] }
  );

  //collapse repeated nodes with and apply logPercentage(<find occurence of each node>, 5)

  const nodesCommitedPopulated = nodesCommited
    .map((node) => {
      const occurence = nodesCommited.filter(
        (n) => n.name === node.name
      ).length;
      return { ...node, popularity: parseFloat(expPercentage(occurence)) };
    })
    .reduce((acc, node) => {
      if (!acc.find((n) => n.name === node.name)) {
        acc.push(node);
      }
      return acc;
    }, []);

  // console.log("nodesCommitedPopulated", nodesCommitedPopulated);

  // const parseNodeCommits = (commit) => {
  //   const [guestname, element, cmd, ] = commit.split(":");

  const handleAddCommits = (extraCommits) => {
    // setCommits([...commits, extraCommits]);
  };
  const srcRef = useRef();
  const trgRef = useRef();
  const { username } = useAuth();
  const { id } = useParams();
  const [openView, setOpenView] = useState(false);
  const [updateProject] = useUpdateProjectMutation();

  const { project } = useGetProjectsQuery("projectsList", {
    selectFromResult: ({ data }) => ({
      project: data?.entities[id],
    }),
  });
  // const { currentUser } = useGetUsersQuery("usersList", {
  //   selectFromResult: ({ data }) => ({
  //     currentUser:
  //       data?.entities[
  //         data?.ids.find((id) => data?.entities[id].username === username)
  //       ],
  //   }),
  // });

  // useEffect(() => {
  //   console.warn("useEffect called");
  //   handleSrcIdChange();
  //   srcRef?.current?.value;
  //   trgId = trgRef?.current?.value;
  // }, [srcRef, trgRef]);

  let nodesContent, linksContent;

  const handleAddNode = async (e) => {
    if (!project.nodes) {
      await updateProject({
        ...project,
        nodes: [
          {
            // gen from dialog
            title: prompt("Enter node title", "Node title"),
            hours: 0,
            priority: 0,
          },
        ],
      });
    } else {
      await updateProject({
        ...project,
        nodes: [
          ...project.nodes,
          {
            title: prompt("Enter node title", "Node title"),
            hours: 0,
            priority: 0,
          },
        ],
      });
    }
  };
  const handleDelNode = async (nodeId) => {
    // console.log("handleDelNode ", nodeId);

    const newNodes = project.nodes.filter((node) => node._id !== nodeId);
    if (newNodes.length > 0) {
      await updateProject({
        ...project,
        nodes: newNodes,
      });
    } else {
      // console.warn("no nodes left");
      await updateProject({
        ...project,
        nodes: null,
      });
    }
  };
  const handleAddLink = async (source, trgId) => {
    console.log("handleAddLink ", source, trgId);
    if (!project.links) {
      await updateProject({
        ...project,
        links: [
          {
            category: "REQ",
            // random generate
            label: (Math.random() + 1).toString(36).substring(7),
            source: srcRef.current.value,
            target: trgRef.current.value,
          },
        ],
      });
    } else {
      await updateProject({
        ...project,
        links: [
          ...project.links,
          {
            category: "REQ",
            label: (Math.random() + 1).toString(36).substring(7),
            source: srcRef.current.value,
            target: trgRef.current.value,
          },
        ],
      });
    }
  };
  const handleDelLink = async (linkId) => {
    console.log("handleDelLink ", linkId);

    const newLinks = project.links.filter((link) => link._id !== linkId);
    if (newLinks.length > 0) {
      await updateProject({
        ...project,
        links: newLinks,
      });
    } else {
      console.warn("no links left");
      await updateProject({
        ...project,
        links: null,
      });
    }
  };

  if (!project) {
    nodesContent = null;
    linksContent = null;
  } else {
    if (!project.nodes) {
      nodesContent = <button onClick={handleAddNode}>Add Node</button>;
    } else {
      nodesContent = (
        <>
          <table>
            <thead>
              <tr>
                <th scope="col">Node</th>
                <th scope="col">hours</th>
                <th scope="col">priority</th>
                <th scope="col">Delete?</th>
              </tr>
            </thead>

            <tbody>
              {project.nodes.map((node, index) => (
                <tr key={index}>
                  <td>{node.title}</td>
                  <td>{node.hours}</td>
                  <td>{node.priority}</td>
                  <td>
                    <button onClick={() => handleDelNode(node._id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddNode}>Add Node</button>
        </>
      );

      if (!project.links) {
        linksContent = (
          <>
            <p> Add link ?</p>
            {/* dropdown with all nodes  */}
            <p>Source</p>
            <select
              ref={srcRef}
              onChange={(e) => handleSrcIdChange(e)}
              defaultValue={project?.nodes[0]?._id}
            >
              {project.nodes &&
                project.nodes.map((node, index) => (
                  <option key={index} value={node._id}>
                    {node.title}
                  </option>
                ))}
            </select>
            <p>Target</p>
            <select
              ref={trgRef}
              onChange={(e) => handleTrgIdChange(e)}
              defaultValue={project?.nodes[0]?._id}
            >
              {project.nodes &&
                project.nodes.map((node, index) => (
                  <option key={index} value={node._id}>
                    {node.title}
                  </option>
                ))}
            </select>
            <button onClick={() => handleAddLink(srcId, trgId)}>
              Add Link
            </button>
          </>
        );
      } else {
        linksContent = (
          <>
            <table>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Label</th>
                  <th scope="col">Source</th>
                  <th scope="col">Target</th>
                  <th scope="col">Delete?</th>
                </tr>
              </thead>

              <tbody>
                {project.links.map((link, index) => (
                  <tr key={index}>
                    <td>{link.category}</td>
                    <td>{link.label}</td>

                    <td>
                      {
                        project.nodes.find((node) => node._id === link.source)
                          ?.title
                      }
                    </td>

                    <td>
                      {
                        project.nodes.find((node) => node._id === link.target)
                          ?.title
                      }
                    </td>
                    <td>
                      <button onClick={() => handleDelLink(link._id)}>
                        Del
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p> Add link ?</p>

            <p>Source</p>
            <select
              ref={srcRef}
              onChange={(e) => handleSrcIdChange(e)}
              defaultValue={project?.nodes[0]?._id}
            >
              {project.nodes &&
                project.nodes.map((node, index) => (
                  <option key={index} value={node._id}>
                    {node.title}
                  </option>
                ))}
            </select>
            <p>Target</p>
            <select
              ref={trgRef}
              onChange={(e) => handleTrgIdChange(e)}
              defaultValue={project?.nodes[0]?._id}
            >
              {project.nodes &&
                project.nodes.map((node, index) => (
                  <option key={index} value={node._id}>
                    {node.title}
                  </option>
                ))}
            </select>
            <button onClick={() => handleAddLink(srcId, trgId)}>
              Add Link
            </button>
          </>
        );
      }
    }
  }

  const userSettings = (
    <>
      <h2>
        Status:
        {project && project?.ownername === username ? "Owner" : "Guest"}
      </h2>
    </>
  );

  const commitsContent = (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">Commit</th>
          </tr>
        </thead>

        <tbody>
          {commits.map((commit, index) => (
            <tr key={index}>
              <td>{commit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {!openView && !nodesContent && <PulseLoader color={"#FFF"} />}
      {!openView && userSettings && nodesContent && linksContent && (
        <>
          {userSettings}
          {nodesContent}
          {linksContent}
          <br />
          <br />
          <button onClick={() => setOpenView(true)}>Open View</button>

          {commitsContent}
        </>
      )}

      {openView && (
        <KMap
          style={{ width: "100%", height: "100%" }}
          d={{
            nodes: project.nodes.map(({ _id, title, ...rest }) => ({
              id: _id,
              name: title,
              by: "owner",
              ...rest,
            })),
            links: project.links.map(({ _id, ...rest }) => ({
              id: _id,
              by: "owner",
              ...rest,
            })),
          }}
          commits={{ nodesCommited:nodesCommitedPopulated, linksCommited }}
          addCommits={handleAddCommits}
          isOwner={project?.ownername === username}
        />
      )}
    </div>
  );
};

export default EditProject;
