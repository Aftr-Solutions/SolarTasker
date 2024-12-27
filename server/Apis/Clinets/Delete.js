const express=require("express");
const router=express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalDelete } = require("../../GlobalFunctions/GlobalDelete");
const RESPONSE = require("../../GlobalResponse/RESPONSE");

router.post("/",(req,res)=>{
    const{id}=req.body;

    if(!id){
        return res.status(400).send(RESPONSE(false, "Missing required 'id' field", {}));
    }

    let payload={
        tableName:tableName.clients,
        databaseFields:{
            id:id,
        },
    };
    console.log("Payload for deletion:", payload);

  // Call the global delete function
  GlobalDelete(payload, res);
})
module.exports=router;