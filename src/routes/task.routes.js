import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { list, create, update, remove } from "../controllers/task.controller.js";

const router = Router();

// todas las rutas protegidas
router.use(auth);
router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
