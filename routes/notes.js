const express = require('express');
const router = express.Router();
const fetchuser = require('../middlewares/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// Route 1 : Get all the notes of user details using: GET '/api/notes/fetchallnotes'

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('Some Internal error occured');
    }
});

// Route 2 : Add new note using POST '/api/notes/addnotes'

router.post('/addnotes', [body('title').isLength({ min: 5 }), body('description').isLength({ min: 5 })], fetchuser, async (req, res) => {

    try {

        // if errors exist return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const saved_note = await note.save();
        res.json(saved_note);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('Some Internal error occured');
    }
})


// Route 3 : Update an existing note PUT "/api/notes/updatenote"

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        //creating a newnote object
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description }
        if (tag) { newnote.tag = tag };

        // find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json({ newnote });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some Internal error occured");
    }
});

// Route 4 : Delete note using delete request '/api/notes/deletenote'

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        // find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some Internal error occured");
    }
});


module.exports = router;