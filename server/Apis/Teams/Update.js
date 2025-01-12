const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");


router.post("/",(req,res)=>{
    const{
        id,
        member1,
        member2,
        member3,
        isactive
    }=req.body;
    if(!id || !member1 ||!member2){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:id,
        tableName:tableName.team,
        table:"Teams",
        databaseFields:{
            member1:member1,
            member2:member2,
            member3:member3,
            isactive:isactive
        },
    };
    logger.info("Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports=router;