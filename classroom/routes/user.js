const express = require("express");
const router = express.Router();

//Users
router.get("/", (req, res) => {
    res.send("get all users");
});

//Show
router.get("/:id", (req, res) => {
    res.send('get for show users');
});
//Post
router.post("/",(req,res)=>{
    res.send("post for create user");
})
//delete
router.delete("/:id", (req, res) => {
    res.send("delete for delete user");
});
//------------------------------------------------

module.exports = router;