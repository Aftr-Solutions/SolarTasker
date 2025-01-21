const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const logger=require("../../logger");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");

router.post("/",(req,res)=>{
    try{
        const getQuery=`SELECT c.name,c.number,tm.team_name,t.service_date,tk.status,tk.time_stamp
        FROM ${tableName.tracking} tk INNER JOIN ${tableName.tasks} t ON tk.task_id=t.id INNER JOIN
        ${tableName.team} tm ON t.team_id=tm.id INNER JOIN ${tableName.clients} c ON t.client_id=c.id
        ORDER BY tk.id DESC;`

        pool.query(getQuery,(err,res)=>{
            if(err){
                logger.info(`Error in fetching records from tracking ${err.message}`);
                return res.status(500).send(RESPONSE(false, "Database error while checking references", err));    
            }else{
                return res.status(200).send(RESPONSE(true,"Successfully Fetched Record From Tracking",{res}));
            }
        });

    }catch(error){
        logger.info(`Error Fetching Live Tracking ${error.message}`)
        res.status(400).send(RESPONSE(false,"Error Fetching Live Tracking",{}))
    };
});