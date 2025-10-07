import Task from "../models/task.model.js";

export async function list(req, res) {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
}

export async function create(req, res) {
    const task = new Task({ ...req.body, user: req.userId });
    await task.save();
    res.json(task);
}

export async function update(req, res) {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
}

export async function remove(req, res) {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ ok: true });
}
