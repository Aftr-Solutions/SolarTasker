const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");


router.post("/",(req,res)=>{
    const{
        member1,
        member2,
        member3,
    }=req.body;
    if(!member1 || !member2){
        return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
    }

    let payload={
        tableName:tableName.team,
        databaseFields:{
            member1,
            member2,
            member3,
        },
        
    };
    logger.info("Payload for insertion:", payload);
    
    GlobalInsert(payload,res);
});
module.exports=router;