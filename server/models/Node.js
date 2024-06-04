const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const nodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

nodeSchema.plugin(AutoIncrement, {inc_field: 'id'});

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
