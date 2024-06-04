import React from 'react'

const EditProjectForm = ({ project }) => {
    
    // table with project details
    // option to add or remove nodes
    let content;

    if (project) {
        content = (
            <form>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={project.title} />
                <label htmlFor="ownername">Owner</label>
                <input type="text" id="ownername" name="ownername" value={project.ownername} />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={project.description} />
                <label htmlFor="nodes">Nodes</label>
                <input type="text" id="nodes" name="nodes" value={project.nodes} />
                <button type="submit">Submit</button>
            </form>
        )
    } else {
        content = <p>Loading...</p>
    }

    return content
}


export default EditProjectForm