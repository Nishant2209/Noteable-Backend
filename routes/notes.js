const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes using: GET "api/notes/fetchnotes". Login required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

//Route 2: Add a new note using: POST "api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchuser,
  body("title", "Title must be of atleast 3 characters").isLength({ min: 3 }),
  body("description", "Description must be of atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const { title, description, tag } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//Route 2: Add a new note using: POST "api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchuser,
  body("title", "Title must be of atleast 3 characters").isLength({ min: 3 }),
  body("description", "Description must be of atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const { title, description, tag } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//Route 3: Update an note using: PUT "api/notes/updatenote". Login Required
router.put(
  "/updatenote/:id",
  fetchuser,
  body("title", "Title must be of atleast 3 characters").isLength({ min: 3 }),
  body("description", "Description must be of atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    const { title, description, tag } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // Find the note to be updated and update it.
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found !");
      }
      if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(newNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//Route 4: Delete a note using: DELETE "api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found !");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json("Note deleted successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

module.exports = router;
