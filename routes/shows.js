const { Router } = require("express");
const showsRouter = Router();
const { Show, User, watched } = require("../models/index")
const { db } = require("../db/connection")
const { check, validationResult } = require("express-validator");

showsRouter.get("/", async (req, res) => {
    const everyShow = await Show.findAll();
    res.json(everyShow);
});

showsRouter.get("/:id", async (req, res) => {
    if (req.params.id > 6) {
        res.status(404);
    }
    const findShow = await Show.findByPk(req.params.id);
    res.json(findShow);
});

showsRouter.get('/genres/:genre', async (req, res) => {
    try {
        const userEnteredGenre = req.params.genre.toLowerCase();
        let genre;
        if (userEnteredGenre.includes("sci")) {
            genre = "Science Fiction";
        } else {
            genre =
                userEnteredGenre.charAt(0).toUpperCase() +
                userEnteredGenre.slice(1).toLowerCase();
        }
        const shows = await Show.findAll({
            where: {
                genre: genre
            }
        });
        if (shows.length === 0) {
            return res.status(404).json({ message: `No shows found with genre: ${genre}` });
        }
        res.status(200).json(shows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

showsRouter.put('/:id/watched', [
    check("rating").isLength({ min: 1, max: 1 }).withMessage("Rating must be 1 character")
    ], async (req, res) => {
    const showId = req.params.id;
    try {
        const showToUpdate = await Show.findByPk(showId);
        if (!showToUpdate) {
            return res.status(404).json({ error: 'Show not found' });
        }
        showToUpdate.rating = req.body.rating || showToUpdate.rating;
        await showToUpdate.save();
        return res.status(200).json(showToUpdate);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

showsRouter.put('/:id/updates', async (req, res) => {
  const showId = req.params.id;
  try {
    const show = await Show.findByPk(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    show.available = !show.available;
    await show.save();
    res.json({ message: 'Show status updated successfully', show });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

showsRouter.delete('/:id', async (req, res) => {
    const showId = req.params.id;
    try {
        const showToDelete = await Show.findByPk(showId);
        if (!showToDelete) {
            return res.status(404).json({ error: 'Show not found' });
        }
        await showToDelete.destroy();
        res.status(200).json({ message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = { showsRouter }