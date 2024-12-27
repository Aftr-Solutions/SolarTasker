const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const {GlobalSelect}=require("../../GlobalFunctions/GlobalSelect");
const RESPONSE=require("../../GlobalResponse/RESPONSE");

router.get("/",(req,res)=>{
    let payload={
        tableName:tableName.workers,
    };
    GlobalSelect(payload,res);
});

module.exports=router;