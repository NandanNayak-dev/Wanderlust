const express = require("express");
const router = express.Router();

//Posts
//Index
router.get("/", (req, res) => {
    res.send("get all post");
});

//Show
router.get("/:id", (req, res) => {
    res.send('get for show post');
});
//Post
router.post("/",(req,res)=>{
    res.send("post for create post");
})
//delete
router.delete("/:id", (req, res) => {
    res.send("delete for delete post");
});
//-------------------------------------------------

module.exports = router;