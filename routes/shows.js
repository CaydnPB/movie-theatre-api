const { Router } = require("express");
const showsRouter = Router();
const { Show, User } = require("../models/index")
const { db } = require("../db/connection")

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

showsRouter.put("/:id", async (req, res) => {
    const updatedShow = await Show.update(req.body, {where: {id: req.params.id}});
    const shows = await Show.findAll();
    res.json(shows);
});

module.exports = { showsRouter }