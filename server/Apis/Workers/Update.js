const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");

router.post("/",(req,res)=>{
    const{
        id,
        name,
        number,
        address
    }=req.body;
    if(!id || !name ||!number){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:id,
        tableName:tableName.workers,
        databaseFields:{
            name:name,
            number:number,
            address:address,
        },
    };
    console.log("Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports=router;