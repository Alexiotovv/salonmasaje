// src/controllers/reviewController.js
import Review from '../models/Review.js';
import { validationResult } from 'express-validator';

const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, masajistaId, servicioId, calificacion, comentario } = req.body;

    const review = await Review.create({
      userId,
      masajistaId,
      servicioId: servicioId || null,
      calificacion,
      comentario
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { estado: true } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

const getReviewsByMasajista = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.findAll({
      where: { masajistaId: id, estado: true }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reseñas del masajista' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    review.calificacion = calificacion ?? review.calificacion;
    review.comentario = comentario ?? review.comentario;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reseña' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    // Desactivar en lugar de borrar (buena práctica)
    review.estado = false;
    await review.save();

    res.json({ message: 'Reseña desactivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reseña' });
  }
};

export { createReview, getReviews, getReviewsByMasajista, updateReview, deleteReview };