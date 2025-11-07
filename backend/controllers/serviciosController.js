const Servicio = require('../models/servicios');

// Obtener todos los servicios
const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo servicio
const crearServicio = async (req, res) => {
    try {
        const { nombre_servicio, duracion_minutos, precio, descripcion, estado } = req.body;
        const nuevo = await Servicio.create({
            nombre_servicio,
            duracion_minutos,
            precio,
            descripcion,
            estado
        });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un servicio por ID
const obtenerServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un servicio existente
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_servicio, duracion_minutos, precio, descripcion, estado } = req.body;
        const servicio = await Servicio.findByPk(id);
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

        await servicio.update({
            nombre_servicio,
            duracion_minutos,
            precio,
            descripcion,
            estado
        });

        res.json(servicio);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un servicio
const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

        await servicio.destroy();
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerServicios,
    crearServicio,
    obtenerServicioPorId,
    actualizarServicio,
    eliminarServicio
};
