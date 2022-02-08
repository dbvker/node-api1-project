// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();

server.use(express.json());

// Hello request
server.get('/hello', async (req, res) => {
    res.json({
        message: 'Hello there!'
    });
});

// Get - get all users
server.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "The users information could not be retrieved" });
    }
});

// Get - get user by id
server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        } else {
            res.json(user);
        }
    } catch (err) {
        res.status(500).json({ message: "The user information could not be retrieved" });
    }
});

// Post - create a user
server.post('/api/users', async (req, res) => {
    const  { name, bio } = req.body;
    try {
        if (!name || !bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" });
        } else {
            const newUser = await User.insert(req.body);
            res.status(201).json(newUser);
        }
    } catch (err) {
        res.status(500).json({ message: "The users information could not be retrieved" });
    }
});

// Delete - deletes user by id
server.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.remove(id)
        if (!deleteUser) {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        } else {
            res.json(deleteUser);
        }
    } catch (err) {
        res.status(500).json({ message: "The user could not be removed" });
    }
});

// Put - updates a user by id
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const updated = await User.update(id, body);
        const user_id = await User.findById(id);
        if (!user_id) {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        } else if (!body.name || !body.bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" });
        } else {
            res.status(200).json(updated)
        }
    } catch (err) {
        res.status(500).json({ message: "The user information could not be modified" });
    }
});


module.exports = server; // EXPORT YOUR SERVER instead of {}
