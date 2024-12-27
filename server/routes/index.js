const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userAuth.js");
const authentication = require("../Apis/Users/login");
const createUser = require("../Apis/Users/Create");

const createclients=require("../Apis/Clinets/Create");
const updateclients=require("../Apis/Clinets/Update");
const deleteclients=require("../Apis/Clinets/Delete");
const selectclients=require("../Apis/Clinets/Select");

const createarea_region=require("../Apis/Area_Region/Create");
const updatearea_region=require("../Apis/Area_Region/Update");
const deletearea_region=require("../Apis/Area_Region/Delete");
const selectarea_region=require("../Apis/Area_Region/Select");

const createworkers=require("../Apis/Workers/Create");
const updateworkers=require("../Apis/Workers/Update");
const deleteworkers=require("../Apis/Workers/Delete");
const selectworkers=require("../Apis/Workers/Select");

// Public route (no userAuth)
router.use("/login", authentication);

// Protected routes (with userAuth)
router.use(userAuth);
router.use("/createUser",createUser);

router.use("/createarea_region",createarea_region);
router.use("/updatearea_region",updatearea_region);
router.use("/deletearea_region",deletearea_region);
router.use("/selectarea_region",selectarea_region);

router.use("/createclients",createclients);
router.use("/updateclients",updateclients);
router.use("/deleteclients",deleteclients);
router.use("/selectclients",selectclients);

router.use("/createworkers",createworkers);
router.use("/updateworkers",updateworkers);
router.use("/deleteworkers",deleteworkers);
router.use("/selectworkers",selectworkers);

module.exports = router;