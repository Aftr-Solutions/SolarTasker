const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE")

router.post("/",(req,res)=>{
    if(!req.body.id||!req.body.area||!req.body.region){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:req.body.id,
        tableName:tableName.area_region,
        databaseFields:{
            area:req.body.area,
            region:req.body.region,
        },
    };
    console.log("Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports = router;