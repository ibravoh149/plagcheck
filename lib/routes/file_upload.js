const express = require("express");
const router = express.Router();
const path = require("path");

router.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({message:"No files were uploaded."});
  }

  const { doc } = req.files;

  const fileName = Date.now() + "-" + doc.name;
  const filePath = path.resolve("temp_upload/" + fileName);

  doc.mv(filePath, (err) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ data: fileName });
  });
});

module.exports = router;
