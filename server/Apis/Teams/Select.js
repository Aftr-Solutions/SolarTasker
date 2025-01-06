const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const {GlobalSelect}=require("../../GlobalFunctions/GlobalSelect");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");


router.get("/",(req,res)=>{
    let payload={
        tableName:tableName.team,
        table:"Teams",
    };
    GlobalSelect(payload,res);
});

module.exports=router;