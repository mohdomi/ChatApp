const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware.js")
const {getUsersForSidebar , getMessagesBetweenTwoUsers , sendMessage} = require("../controllers/message.controller.js")


router.get("/users" ,protectRoute , getUsersForSidebar);
router.get("/:id" , protectRoute , getMessagesBetweenTwoUsers);

router.post("/send/:id" , protectRoute , sendMessage )




module.exports = router;
