const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");

router.post("/",(req,res)=>{
    const{
        name,
        number,
        address
    }=req.body;
    if(!name || !number){
        return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
    }

    let payload={
        tableName:tableName.workers,
        databaseFields:{
            name,
            number,
            address,
        },
        
    };
    console.log("Payload for insertion:", payload);
    
    GlobalInsert(payload,res);
});
module.exports=router;