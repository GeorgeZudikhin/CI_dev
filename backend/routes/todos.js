const { body, validationResult } = require('express-validator');
const db = require('../db/db');
const express = require('express')
const jwt = require('jsonwebtoken');
const router = express.Router();

const secret = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNzg3MTE4MCwiaWF0IjoxNzE3ODcxMTgwfQ.q9Rfw44JmtEWdPOTIlEcCKi0YZfwXJas_2NUvt6TfMY\n';

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

/* Read all todos */
router.get('/', authenticate, async (req, res, next) => {
    const todos = await db.models.todo.findAll({ where: { userId: req.user.id } });

    res.status(200).json(todos);
});

/* Create todos */
router.post('/', authenticate, [
    body('name').not().isEmpty(),
    body('name').isLength({ max: 255 })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const todo = await db.models.todo.create({
            name: req.body.name,
            userId: req.user.id
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/* Update todos with done */
router.put('/:id/done', authenticate, async (req, res, next) => {
    const id = req.params.id;
    let todo = await db.models.todo.findOne({ where: { id: id, userId: req.user.id } });

    if (null == todo) {
        res.status(404);
        return;
    }

    todo = await todo.update({ done: true });

    res.status(200).json(todo);
});

/* Update todos with undone */
router.delete('/:id/done', authenticate, async (req, res, next) => {
    const id = req.params.id;
    let todo = await db.models.todo.findOne({ where: { id: id, userId: req.user.id } });

    if (null == todo) {
        res.status(404);
        return;
    }

    todo = await todo.update({ done: false });

    res.status(200).json(todo);
});

module.exports = router;
