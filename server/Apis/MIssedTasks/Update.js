const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const logger = require("../../logger");
const { pool } = require("../../Utils/crondb");


router.post("/",(req,res)=>{
    if (!req.body.id||!req.body.team_id||!req.body.response||!req.body.task_status||!req.body.name||!req.body.number){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
   const insertquery=`INSERT INTO ${tableName.tasks} VALUES ?`;
    });

    pool.query(insertquery,(err,result)=>{
        if(err){
            logger.error("Error while fetching data from clients table:", err);
        return res.status(500)
        .send(RESPONSE(false, "Database error while fetching data", err));
        }

    });
    
module.exports = router;
