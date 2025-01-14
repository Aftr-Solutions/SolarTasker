const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");


router.post("/",(req,res)=>{
    if (!req.body.id||!req.body.team_id||!req.body.response||!req.body.task_status){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:req.body.id,
        tableName:tableName.tasks,
        table:"Tasks",
        databaseFields:{
            team_id:req.body.team_id,
            response:req.body.response,
            task_status:req.body.task_status
        }
    }
    logger.info("Payload for update:", payload);
    
        GlobalUpdate(payload,res);
    });
    
module.exports = router;
