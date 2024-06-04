const Node = require('../models/Node');

// Get all nodes
const getAllNodes = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new node
const createNewNode = async (req, res) => {
    const node = new Node({
        name: req.body.name
    });

    try {
        const newNode = await node.save();
        res.status(201).json(newNode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a node
const updateNode = async (req, res) => {
    try {
        const node = await Node.findById(req.body.id);
        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }
        if (req.body.name) node.name = req.body.name;

        const updatedNode = await node.save();
        res.json(updatedNode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a node
const deleteNode = async (req, res) => {
    try {
        const node = await Node.findByIdAndDelete(req.body.id);
        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }
        res.json({ message: 'Node deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllNodes,
    createNewNode,
    updateNode,
    deleteNode
};
