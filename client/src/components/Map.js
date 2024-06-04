// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import io from "socket.io-client";

// const socket = io('http://localhost:3000');

// const Map = () => {
//     const { id: mapId } = useParams();
//     const [nodes, setNodes] = useState([]);

//     useEffect(() => {
//         // Load initial nodes from server
//         axios.get('/nodes')
//             .then(response => {
//                 setNodes(response.data);
//             })
//             .catch(error => {
//                 console.error("There was an error fetching the nodes!", error);
//             });

//         // Listen for node added event
//         socket.on('nodeAdded', (newNode) => {
//             setNodes(prevNodes => [...prevNodes, newNode]);
//         });

//         // Listen for node removed event
//         socket.on('nodeRemoved', (nodeId) => {
//             setNodes(prevNodes => prevNodes.filter(node => node._id !== nodeId));
//         });

//         return () => {
//             socket.off('nodeAdded');
//             socket.off('nodeRemoved');
//         };
//     }, []);

//     const addNode = () => {
//         const newNode = {
//             name: Math.random().toString(36).substr(2, 5) // Generate a random name
//         };
//         axios.post('/nodes', newNode)
//             .then(response => {
//                 // The new node will be added through the 'nodeAdded' event
//             })
//             .catch(error => {
//                 console.error("There was an error creating the node!", error);
//             });
//     };

//     const removeNode = () => {
//         if (nodes.length > 0) {
//             const lastNode = nodes[nodes.length - 1];
//             axios.delete(`/nodes/${lastNode._id}`)
//                 .then(response => {
//                     // The node will be removed through the 'nodeRemoved' event
//                 })
//                 .catch(error => {
//                     console.error("There was an error deleting the node!", error);
//                 });
//         }
//     };

//     const content = (
//         <section>
//             <header>
//                 <h1>Map ID: {mapId}</h1>
//             </header>
//             <main>
//                 {nodes.map((node) => (
//                     <div key={node._id}>
//                         <p>ID: {node.id}</p>
//                         <p>Name: {node.name}</p>
//                     </div>
//                 ))}
//                 <button onClick={addNode}>+1</button>
//                 <button onClick={removeNode}>-1</button>
//             </main>
//         </section>
//     );

//     return content;
// };

// export default Map;
