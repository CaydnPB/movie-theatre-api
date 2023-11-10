const { Router } = require("express");
const usersRouter = Router();
const { Show, User, watched } = require("../models/index")
const { db } = require("../db/connection")

usersRouter.get("/", async (req, res) => {
    const everyUser = await User.findAll();
    res.json(everyUser);
});

usersRouter.get("/:id", async (req, res) => {
    if (req.params.id > 2) {
        res.status(404);
    }
    const findUser = await User.findByPk(req.params.id);
    res.json(findUser);
});

usersRouter.get("/:id/shows", async (req, res) => {
    try {
        const findUser = await User.findByPk(req.params.id, {
            include: [{
                model: Show,
                through: watched,
                as: 'shows',
            }],
        });
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(findUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

usersRouter.put("/:userId/shows/:showId", async (req, res) => {
  const { userId, showId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const show = await Show.findByPk(showId);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    const isWatched = await watched.findOne({
      where: {
        UserId: userId,
        ShowId: showId,
      },
    });
    if (isWatched) {
      return res.status(400).json({ error: 'User has already watched this show' });
    }
    await user.addShow(show);
    res.json({ message: 'Show added to user\'s watched list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { usersRouter }