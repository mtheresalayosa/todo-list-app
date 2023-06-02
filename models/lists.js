import mongoose from "mongoose";

const TodoList = mongoose.model('Todos', new mongoose.Schema({
    list_id: {type: Number},
    details: { type: String, required: true },
}));

export default TodoList;