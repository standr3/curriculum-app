import React, { useState, useRef, useEffect } from "react";
import {
  select,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  drag,
} from "d3";
import useResizeObserver from "./useResizeObserver";
import iconDelete from "./delete_icon.svg";
import iconEdit from "./edit_icon.svg";
import "./my-sass.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import KmapSettings from "./KmapSettings";
import KmapActions from "./KmapActions";
import KmapSave from "./KmapSave";
import KmapNotifier from "./KmapNotifier";
import KmapControlPanel from "./KmapControlPanel";

function KMap({
  d,
  sD,
  handlers,
  selectedID = null,
  commits,
  // addCommits, // addCommit
  isOwner,
}) {

  const [currentChanges, setCurrentChanges] = useState([]);
  // console.log("Kmap data d: ", d);
  // alert("isOwner: " + isOwner);
  const [data, setData] = useState({
    nodes: [...d.nodes],
    links: [...d.links],
  });
  const svgRef = useRef();
  const wrapperRef = useRef();

  const dim = useResizeObserver(wrapperRef);

  const [clickedNode, setClickedNode] = useState(null);
  const [clickedLinkId, setClickedLinkId] = useState(null);
  const [showCategory, setShowCategory] = useState(false);

  const [toggleSettings, setToggleSettings] = useState(false);
  const [linkDistance, setLinkDistance] = useState(24);
  const [fontSize, setFontSize] = useState(16);
  const [toggleRename, setToggleRename] = useState(false);
  const [toRename, setToRename] = useState("-");
  const [syncNeeded, setSyncNeeded] = useState(false);
  const [toggleAdd, setToggleAdd] = useState(false);
  const [waitingForLink, setWaitingForLink] = useState(false);
  const [placeLinkMode, setPlaceLinkMode] = useState(false);
  const [sourceNode, setSourceNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);
  const [placeNodeMode, setPlaceNodeMode] = useState(false);

  const [ctrlMode, setCtrlMode] = useState(null);
  const [focusedNode, setFocusedNode] = useState(null);
  const [focusedLink, setFocusedLink] = useState(null);

  const switchControlMode = (subject, action, datum) => {
    // console.warn("switchControlMode: ", subject, action, datum);
    setCtrlMode({ subject: subject, action: action });
    if (subject === "node") {
      if (action === "create") {
        setFocusedNode({
          // index: data.nodes.length,
          // id: Math.random().toString(36).substring(7),
          name: "untitled",
          hours: 0,
          priority: 0,
        });
      } else if (action === "delete") {
        const newNodes = data.nodes.filter((n) => n.name !== datum.name);
        const newLinks = data.links.filter(
          (l) => l.source.name !== datum.name && l.target.name !== datum.name
        );
        setData({ nodes: newNodes, links: newLinks });
        setSyncNeeded(true);
        setFocusedNode(null);
        setCtrlMode(null);
      } else {
        setFocusedNode(datum);
      }
    } else if (subject === "link") {
      if (action === "create") {
        setFocusedNode(null);
        setSourceNode(null);
        setTargetNode(null);
        setFocusedLink({
          index: data.links.length,
          id: Math.random().toString(36).substring(7),
          source: null,
          target: null,
          category: "REQ",
          label: null,
        });
      } else if (action === "switch") {
        const linkId = datum.id;
        const link = data.links.find((l) => l.id === linkId);
        const newLink = { ...link, source: link.target, target: link.source };
        const newLinks = data.links.map((l) => (l.id === linkId ? newLink : l));

        setData({ nodes: data.nodes, links: newLinks });
        setSyncNeeded(true);
        setFocusedNode(datum.focused);
        setCtrlMode("node", "links");
      } else if (action === "delete") {
        const newLinks = data.links.filter((l) => l.id !== datum.id);
        setData({ nodes: data.nodes, links: newLinks });
        setSyncNeeded(true);
        setFocusedLink(null);
        setCtrlMode(null);
      } else {
        setFocusedLink(datum);
      }
    }
  };

  const linkToString = (linkId) => {
    const link = data.links.find((l) => l.id === linkId);
    return (
      link.source.name +
      " -" +
      link.category +
      ":" +
      (link.label ? link.label : "") +
      "-> " +
      link.target.name
    );
  };
  // useEffect(() => {
  //   if (syncNeeded) {
  //     alert("Syncing data");
  //     setSyncNeeded(false);
  //   }
  // }, [syncNeeded]);

  useEffect(() => {
    console.log("useEffect data: " + data);
    let tempForces = {};

    if (!dim) return;
    // console.log("dims " + dim.width + " " + dim.height);

    const svg = select(svgRef.current);

    // centering workaround
    svg.attr("viewBox", [
      -dim.width / 2,
      -dim.height / 2,
      dim.width,
      dim.height,
    ]);

    // on esc press
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setCtrlMode(null);
        setFocusedNode(null);
        setFocusedLink(null);

        setClickedNode(null);
        setClickedLinkId(null);
        setToggleRename(false);
        setToRename("-");

        setPlaceLinkMode(false);
        setSourceNode(null);
        setTargetNode(null);
      }
    });

    console.warn("commits ", commits);
    console.warn("data ", data);

    const nodeData = data.nodes.concat(commits.nodesCommited);
    const linkData = data.links.concat(commits.linksCommited);

    svg.data([linkData]).append("g").attr("class", "links");
    svg.data([nodeData]).append("g").attr("class", "nodes");

    const simulation = forceSimulation(nodeData)
      .alpha(0.1)
      .alphaDecay(0.1)
      .force(
        "link",
        forceLink(linkData)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("center", forceCenter(0, 0))
      .force("charge", forceManyBody().strength(-30)) // PULL NODES TOGETHER; 1000 CENTER; -30 DEFAULT PUSH
      .force("collide", forceCollide(70)) // AREA OF PUSH BACK; -1000 CENTER; 70 DEFAULT
      .on("tick", () => {
        // links
        svg
          .select(".links")
          .selectAll(".link-cell")
          .data(
            linkData,
            (d) => JSON.stringify(d.source) + JSON.stringify(d.target)
          )
          .join(
            (enter) => enterLinkData(enter),
            (update) => updateLinkData(update)
          );

        svg
          .select(".nodes")
          .selectAll(".node-cell")
          // stringify the data and x,y to prevent re-rendering
          .data(nodeData, (d) => JSON.stringify(d + d.x + d.y))
          .join(
            (enter) => enterNodeData(enter),
            (update) => updateNodeData(update)
          )
          .call(
            drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );
      });

    function enterLinkData(enter) {
      //build cells
      let linkCell = enter.append("g").attr("class", "link-cell");

      linkCell
        .append("line")
        .attr("class", "link")
        .attr("id", (link) => link.id)
        .attr("by", (link) => link.by)
        .attr("from", (link) => link.source.name)
        .attr("to", (link) => link.target.name)
        .style("stroke", "#10162f")
        .style("stroke-width", "3px")
        .attr("category", (link) => link.category)
        .attr("label", (link) => link.label)
        .attr("x1", (link) => link.source.x)
        .attr("y1", (link) => link.source.y)
        .attr("x2", (link) => link.target.x)
        .attr("y2", (link) => link.target.y);

      let edgePath = linkCell
        .append("path")
        .attr("class", "edgepath")
        // .attr("stroke", "red")
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .attr("id", function (d, i) {
          return "edgepath" + i;
        })
        .attr(
          "d",
          (d) =>
            "M " +
            d.source.x +
            " " +
            d.source.y +
            " L " +
            d.target.x +
            " " +
            d.target.y
        )
        .style("pointer-events", "none");

      let edgeLabel = linkCell
        .append("text")
        .style("visibility", showCategory ? "visible" : "hidden")
        .style("pointer-events", "none")
        .attr("class", "edgelabel")
        .attr("id", function (d, i) {
          return "edgelabel" + i;
        })
        .attr("font-size", 16)
        .attr("font-family", "Share Tech Mono, monospace")
        .attr("font-weight", 700)
        .attr("dy", -5)
        .attr("fill", "#000");

      edgeLabel
        .append("textPath") //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
        .attr("xlink:href", function (d, i) {
          return "#edgepath" + i;
        })
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function (d) {
          return d.category;
        });

      return linkCell;
    }
    function updateLinkData(update) {
      // console.warn("updateLinkData", update);
      update
        .selectAll(".link")
        .style("stroke-width", "3px")
        .attr("from", (link) => link.source.name)
        .attr("to", (link) => link.target.name)
        .attr("category", (link) => link.category)
        .attr("label", (link) => link.label)
        .attr("x1", (link) => link.source.x)
        .attr("y1", (link) => link.source.y)
        .attr("x2", (link) => link.target.x)
        .attr("y2", (link) => link.target.y);

      update
        .selectAll(".edgepath")
        .attr(
          "d",
          (link) =>
            "M " +
            link.source.x +
            " " +
            link.source.y +
            " L " +
            link.target.x +
            " " +
            link.target.y
        )
        .style("pointer-events", "none");

      update
        .selectAll(".edgelabel")
        .style("visibility", showCategory ? "visible" : "hidden");

      update // klick
        .selectAll(".link")
        .on("click", function (event) {
          if (event.defaultPrevented) return; // click suppressed

          if (ctrlMode?.action === "create" && ctrlMode?.subject === "link") {
            // setFocusedLink({
            //   index: this.getAttribute("index"),
            //   id: this.getAttribute("id"),
            //   source: this.getAttribute("from"),
            //   target: this.getAttribute("to"),
            //   category: this.getAttribute("category"),
            //   label: this.getAttribute("label") || null,
            // });
          } else {
            const thisLink = linkData.find(
              (l) => l.id === this.getAttribute("id")
            );
            console.warn("thisLink", thisLink);

            switchControlMode("link", "inspect", {
              index: thisLink?.index,
              id: thisLink?.id,
              source: thisLink.source,
              target: thisLink.target,
              category: thisLink.category,
              label: thisLink?.label || null,
            });

            // setClickedLinkId(this.getAttribute("id"));
            // console.log(select(this).attr("id"));

            select(this)
              .style("stroke", "#66C2FF")
              .style("stroke-width", "6px");
          }
        })
        .on("mouseover", function (event) {
          select(this).style("stroke", "#fcba03").style("stroke-width", "6px");
        })
        .on("mouseout", function (event) {
          select(this).style("stroke", "#10162f").style("stroke-width", "3px");
        });

      // if this is the focused link, highlight it
      // select(this)
      // .style("stroke", "#66C2FF")
      // .style("stroke-width", "6px");
      update.selectAll(".link").each(function (d) {
        if (focusedLink && d.id === focusedLink.id) {
          select(this).style("stroke", "#66C2FF").style("stroke-width", "6px");
        } else {
          select(this).style("stroke", "#10162f").style("stroke-width", "3px");
        }
      });

      return update;
    }

    // =============================================================================== U P D A T E === //
    function updateNodeData(update) {
      setupBoxes(update.selectAll(".node-box"));

      return update;
    }
    // ================================================================================= E N T E R === //
    function enterNodeData(enter) {
      // console.warn("enterNodeData");
      let nodeCells = buildCells(enter);
      let nodeBoxes = buildBoxes(nodeCells);
      // setupLabels(buildLabels(nodeCells));
      setupBoxes(nodeBoxes);
      // enter
      return nodeCells;
    }
    function buildCells(svg) {
      return svg.append("g").attr("class", "node-cell").style("z-index", 1000);
    }

    function buildBoxes(svg) {
      return (
        svg
          .append("foreignObject")
          .style("z-index", 1000)
          .attr("nodeId", (node) => node.id)
          .attr("by", (node) => node.by)
          .attr("class", "node-box")
          .attr("name", (node) => node.name)
          // .style("border", "1px solid red")
          .html(function (d, i) {
            return `
            <div class="node-box-cell unselectable">
              <div class="node-box-toolbar">
                <img src=${iconEdit} class="node-btn btn-edit"  />
                <img src=${iconDelete} class="node-btn btn-delete"   />
              </div>
              <div class="node-box-card">
                <p>${d.name}</p>
              </div>
            </div> 
            `;
          })
      );
      // .attr("stroke", (node) => (selectedID == node.id ? "red" : "#808080"))
      // .attr("fill", (node) => (selectedID == node.id ? "pink" : "#dfdfdf"))
      // .attr("fill-opacity", 1)
      // .on("click", function (event) {
      //   if (event.defaultPrevented) return; // click suppressed
      //   // console.log(this.getAttribute("nodeId"));
      //   let id = parseInt(this.getAttribute("nodeId"));
      //   console.warn("force tree " + id);
      //   handlers.navEdit(id);
      // });

      // (event) => {
      //   const [x, y] = pointer(event);
      //   simulation
      //     .alpha(0.5)
      //     .restart()
      //     .force("orbit", forceRadial(100, x, y).strength(0.8));
    }
    function setupBoxes(svg) {
      return svg
        .attr("x", (node) => node.x)
        .attr("y", (node) => node.y)
        .attr("popularity", (node) => node?.popularity || 1)
        .each(function (d) {
          if (
            d.name === focusedNode?.name ||
            d.name === sourceNode ||
            d.name === targetNode
          ) {
            select(this)
              .select(".node-box-card")
              .style("background-color", "#66C2FF");
            select(this).select(".node-box-card").style("color", "#10162f");
          } else if (d?.popularity) {
            select(this)
              .select(".node-box-card")
              .style("background-color", `rgba(	252, 186, 3, ${d.popularity})`); // red
            select(this).select(".node-box-card").style("color", "#10162f");
          } else {
            select(this)
              .select(".node-box-card")
              .style("background-color", "#fcba03");
            select(this).select(".node-box-card").style("color", "#10162f");
          }

          select(this)
            .selectAll(".btn-edit")
            .on("click", function (event) {
              // setToRename(d.name);
              // setToggleRename(true);

              switchControlMode("node", "rename", {
                index: d.index,
                id: d.id,
                name: d.name,
                hours: d.hours,
                priority: d.priority,
              });

              // select(this).select(".node-box-card").select("p").text(d.name);
              // console.log("edit node: ", d.name);
            });

          select(this)
            .selectAll(".btn-delete")
            .on("click", function (event) {
              switchControlMode("node", "delete", {
                index: d.index,
                id: d.id,
                name: d.name,
              });
            });

          select(this) // klick
            .selectAll(".node-box-card")
            .on("click", function (event) {
              if (event.defaultPrevented) return; // click suppressed

              if (
                ctrlMode?.action === "create" &&
                ctrlMode?.subject === "link"
              ) {
                if (!sourceNode) {
                  setSourceNode(this.childNodes[1].innerText);
                } else {
                  setTargetNode(this.childNodes[1].innerText);
                }
              } else {
                // setClickedNode(this.childNodes[1].innerText);

                switchControlMode("node", "inspect", {
                  index: d.index,
                  id: d.id,
                  name: d.name,
                  hours: d.hours,
                  priority: d.priority,
                });
              }
            });

          select(this)
            .select(".node-box-card")
            .select("p")
            .style("font-size", fontSize + "px");
          const preCompCard = select(this)
            .select(".node-box-card")
            .node()
            .getBoundingClientRect();

          const preCompToolbar = select(this)
            .select(".node-box-toolbar")
            .node()
            .getBoundingClientRect();
          const preWidthCard = parseFloat(preCompCard.width + 7); // extra for shadow
          const preHeightCard = parseFloat(preCompCard.height + 7); // extra for shadow

          const preWidthToolbar = parseFloat(preCompToolbar.width + 7); // extra for shadow
          const preHeightToolbar = parseFloat(preCompToolbar.height + 7); // extra for shadow

          this.setAttribute("width", preWidthCard);
          this.setAttribute("height", preHeightCard + preHeightToolbar);
          // translate the box to center
          this.setAttribute(
            "transform",
            `translate
              (${-preWidthCard / 2},${-preHeightCard / 2 - preHeightToolbar})`
          );

          if (selectedID != null && d.id == selectedID) {
            d.x = 0;
            d.y = 0;
          }
        })
        .on("mouseover", function (event) {
          select(this).select(".node-box-toolbar").style("display", "flex");
          select(this)
            .select(".node-box-card")
            .style("background-color", "white");
          select(this).select(".node-box-card").style("color", "#fcba03");

          const preCompCard = select(this)
            .select(".node-box-card")
            .node()
            .getBoundingClientRect();

          const preCompToolbar = select(this)
            .select(".node-box-toolbar")
            .node()
            .getBoundingClientRect();
          const preWidthCard = parseFloat(preCompCard.width + 7); // extra for shadow
          const preHeightCard = parseFloat(preCompCard.height + 7); // extra for shadow
          const preWidthToolbar = parseFloat(preCompToolbar.width + 7); // extra for shadow
          const preHeightToolbar = parseFloat(preCompToolbar.height + 7); // extra for shadow

          this.setAttribute("width", preWidthCard);
          this.setAttribute("height", preHeightCard + preHeightToolbar);
          // translate the box to center
          this.setAttribute(
            "transform",
            `translate
              (${-preWidthCard / 2},${-preHeightCard / 2 - preHeightToolbar})`
          );
        })
        .on("mouseout", function (event) {
          const currText = select(this)
            .select(".node-box-card")
            .select("p")
            .text();
          if (
            currText === focusedNode?.name ||
            currText === sourceNode ||
            currText === targetNode
          ) {
            console.log("mouse out clicked node");
            select(this)
              .select(".node-box-card")
              .style("background-color", "#66C2FF");
            select(this).select(".node-box-card").style("color", "#10162f");
          }
          // else if (node?.popularity) {
          //   select(this)
          //     .select(".node-box-card")
          //     .style("background-color", `rgba(	252, 186, 3, ${node.popularity})`); // red
          //   select(this).select(".node-box-card").style("color", "#10162f");
          // }
          else {
            select(this)
              .select(".node-box-card")
              .style(
                "background-color",
                `rgba(	252, 186, 3, ${this.getAttribute("popularity")})`
              ); // red
            select(this).select(".node-box-card").style("color", "#10162f");
          }

          select(this).select(".node-box-toolbar").style("display", "none");

          const preCompCard = select(this)
            .select(".node-box-card")
            .node()
            .getBoundingClientRect();

          const preCompToolbar = select(this)
            .select(".node-box-toolbar")
            .node()
            .getBoundingClientRect();
          const preWidthCard = parseFloat(preCompCard.width + 7); // extra for shadow
          const preHeightCard = parseFloat(preCompCard.height + 7); // extra for shadow

          const preWidthToolbar = parseFloat(preCompToolbar.width + 7); // extra for shadow
          const preHeightToolbar = parseFloat(preCompToolbar.height + 7); // extra for shadow

          this.setAttribute("width", preWidthCard);
          this.setAttribute("height", preHeightCard + preHeightToolbar);
          // translate the box to center
          this.setAttribute(
            "transform",
            `translate
            (${-preWidthCard / 2},${-preHeightCard / 2 - preHeightToolbar})`
          );
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const modifyForces = (simulation) => {
      tempForces = {};
      // For example, I want to temporarily remove the "link" and "charge" forces during dragging.
      ["link", "charge"].forEach((forceName) => {
        tempForces[forceName] = simulation.force(forceName);
        simulation.force(forceName, null);
      });
      // You may modify your forces here. Store them to 'tempForces' if you'd like to restore them after dragging.
    };
    const restoreForces = (simulation) => {
      for (let [name, force] of Object.entries(tempForces)) {
        simulation.force(name, force);
      }
      tempForces = {};
    };
    function dragstarted(event) {
      modifyForces(simulation); // Modifying
      if (!event.active) {
        simulation.alphaTarget(0.1).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      restoreForces(simulation); // Restoring
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }
  });

  return (
    <>
      <div
        className="kmap-container"
        ref={wrapperRef}
        style={{ width: "100%", height: "100%" }}
      >
        <KmapActions
          handlers={{
            placeNode: { setState: setPlaceNodeMode },
            clickedNode: { state: clickedNode, setState: setClickedNode },
            placeLink: { setState: setPlaceLinkMode },
            switchControlMode: switchControlMode,
          }}
        />

        <KmapSave
          handlers={{
            syncNeeded: { state: syncNeeded, setState: setSyncNeeded },
          }}
        />

        <KmapNotifier
          handlers={{
            ctrlMode: { state: ctrlMode },
          }}
        />

        <KmapControlPanel
          data={{ state: data, setState: setData }}
          handlers={{
            clickedNode: { state: clickedNode, setState: setClickedNode },
            clickedLinkId: { state: clickedLinkId, setState: setClickedLinkId },
            toggleRename: { state: toggleRename, setState: setToggleRename },
            toRename: { state: toRename, setState: setToRename },
            placeLinkMode: { state: placeLinkMode, setState: setPlaceLinkMode },
            placeNodeMode: { state: placeNodeMode, setState: setPlaceNodeMode },
            syncNeeded: { state: syncNeeded, setState: setSyncNeeded },
            focusedNode: { state: focusedNode, setState: setFocusedNode },
            focusedLink: { state: focusedLink, setState: setFocusedLink },
            ctrlMode: { state: ctrlMode, setState: setCtrlMode },
            switchControlMode: switchControlMode,
            targetNode: { state: targetNode, setState: setTargetNode },
            sourceNode: { state: sourceNode, setState: setSourceNode },
          }}
        />

        {/*                                                                     TOP RIGHT KMAP          @@select  @@tr  */}
        {/* {(clickedNode ||
          clickedLinkId ||
          toggleRename ||
          placeLinkMode ||
          placeNodeMode)  */}
        {false && (
          <div className="kmap-tooltip fixTR">
            {clickedNode && (
              <div className="kmap-tooltip-item  stick-right">
                <p className="unselectable color-change mt ml mr">
                  Selected node: {clickedNode}
                </p>
                <div className="h-flex mt mb mr">
                  <button className="round-btn small-btn">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button className="round-btn small-btn ml">
                    <FontAwesomeIcon icon={faLink} />
                  </button>
                </div>
              </div>
            )}
            {clickedLinkId && (
              <div className="kmap-tooltip-item  stick-right">
                <p className="unselectable color-change mt ml mr">
                  Selected link: {linkToString(clickedLinkId)}
                </p>
                {/* <div className="h-flex mt mb mr">
                  <button className="round-btn small-btn">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <button className="round-btn small-btn ml">
                    <FontAwesomeIcon icon={faLink} />
                  </button>
                </div> */}
              </div>
            )}

            {toggleRename && (
              <form
                className="kmap-tooltip-item stick-left"
                onSubmit={(e) => {
                  e.preventDefault();
                  setToggleRename(false);
                  // action(toRename, { newName: e.target.newName.value })
                  //search for node with name toRename and update it
                  const newName = e.target.newName.value;
                  const node = data.nodes.find((n) => n.name === toRename);
                  if (node) {
                    const newNode = { ...node, name: newName };
                    const newNodes = data.nodes.map((n) =>
                      n.id === node.id ? newNode : n
                    );

                    const newLinks = data.links.map((l) => {
                      if (l.source.id === node.id) {
                        return { ...l, source: newNode };
                      } else if (l.target.id === node.id) {
                        return { ...l, target: newNode };
                      }
                      return l;
                    });

                    setData({ nodes: newNodes, links: newLinks });
                    setSyncNeeded(true);
                    clickedNode && setClickedNode(newName);
                  }
                  setToRename("-");
                  setToggleRename(false);
                }}
              >
                <p className="mt ml mr">Change name: {toRename}</p>
                <div className="input-container mt ml mb">
                  <input
                    type="text"
                    name="newName"
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </form>
            )}

            {/*                                                                 LINK PLACING GUIDE                      */}
            {placeLinkMode && (
              <div className="sh-border bg-beige">
                {sourceNode ? (
                  <>
                    <span>Source node: {sourceNode}</span>
                    <button
                      onClick={() => {
                        setSourceNode(null);
                      }}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <p className="color-change">Click on the source node</p>
                )}
                {targetNode ? (
                  <>
                    <span>Target node: {targetNode}</span>
                    <button
                      onClick={() => {
                        setTargetNode(null);
                      }}
                    >
                      X
                    </button>
                  </>
                ) : (
                  sourceNode && (
                    <p className="color-change">Click on the target node</p>
                  )
                )}

                {sourceNode && targetNode && (
                  <div>
                    {sourceNode === targetNode ? (
                      <p className="warning">
                        Source and target must be diferent!
                      </p>
                    ) : // check if source and target are not already linked
                    data.links.find(
                        (l) =>
                          l.source.name === sourceNode &&
                          l.target.name === targetNode
                      ) ? (
                      <p className="warning">
                        Source and target are already linked!
                      </p>
                    ) : data.links.find(
                        (l) =>
                          l.source.name === targetNode &&
                          l.target.name === sourceNode
                      ) ? (
                      <p className="warning">
                        Only one link between nodes is allowed!
                      </p>
                    ) : (
                      // link : {id(autogenerated), category, label(optional), source, target}
                      // dropdown for category
                      // input for label
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // action({ type: "ADD_LINK", payload: { source: sourceNode, target: targetNode, category: e.target.category.value, label: e.target.label.value } })
                          // console.log("add link");
                          // alert("select source node");
                          const id = Math.random().toString(36).substr(2, 9);
                          const category = e.target.category.value;
                          const label = e.target.label.value || null;

                          const newLink = {
                            id: id,
                            category: category,
                            label: label,
                            source: data.nodes.find(
                              (n) => n.name === sourceNode
                            ),
                            target: data.nodes.find(
                              (n) => n.name === targetNode
                            ),
                          };

                          const newLinks = [...data.links, newLink];
                          setData({ nodes: data.nodes, links: newLinks });
                          setSyncNeeded(true);
                          setPlaceLinkMode(false);
                          setSourceNode(null);
                          setTargetNode(null);
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
                          <input type="text" name="label" placeholder="Label" />
                        </div>
                        <button type="submit">Add Link</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {placeNodeMode && (
              <div className="sh-border bg-beige">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const id = Math.random().toString(36).substr(2, 9);
                    const newNode = {
                      id: id,
                      name: e.target.name.value,
                      hours: 0,
                      priority: 0,
                      index: data.nodes.length,
                    };

                    const newNodes = [...data.nodes, newNode];
                    setData({ nodes: newNodes, links: data.links });
                    setSyncNeeded(true);
                    setPlaceNodeMode(false);
                  }}
                >
                  <div className="input-container">
                    <input
                      type="text"
                      name="name"
                      placeholder="Node name"
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="number"
                      name="hours"
                      placeholder="Hours"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="number"
                      name="priority"
                      placeholder="Priority"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                  <button type="submit">Add Node</button>
                </form>
              </div>
            )}
          </div>
        )}

        <KmapSettings
          handlers={{
            category: {
              state: showCategory,
              setState: setShowCategory,
            },
            linkDistance: {
              state: linkDistance,
              setState: setLinkDistance,
            },
            fontSize: {
              state: fontSize,
              setState: setFontSize,
            },
          }}
        />

        <svg ref={svgRef}></svg>
      </div>
    </>
  );
}

export default KMap;
