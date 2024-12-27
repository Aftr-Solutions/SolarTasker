const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");

router.post("/", (req, res) => {
  const {
    area,
    region,
  } = req.body;

  // Validate required fields
  if (!region||!area) {
    return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
  }

  // Create payload
  let payload = {
    tableName: tableName.area_region,
    databaseFields: {
      area,
      region
    },
  };

  console.log("Payload for insertion:", payload);

  // Perform database insertion
  GlobalInsert(payload, res);
});

module.exports = router;
