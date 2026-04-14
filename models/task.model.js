import mongoose from 'mongoose';

const taskModel= new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
   status: {
    type: String,
    enum: [
        'pending',        
        'in progress',     
        'pending approval',
        'completed'         
    ],
    default: 'pending'
}
});
const Task = mongoose.model('Task', taskModel);

export default Task;