import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Registrar usuario
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "El correo ya está registrado" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
}

// Login usuario
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en login" });
    }
}

// Obtener perfil del usuario
export async function profile(req, res) {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener perfil" });
    }
}
