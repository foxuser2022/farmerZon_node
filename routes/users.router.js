const express = require("express");
const router = express.Router();
const { getDashboardUsers, approveUser, deleteUser } = require("../controllers/users.controller");

router.get("/", getDashboardUsers);
router.put("/:id", approveUser);
router.delete("/:id", deleteUser);

module.exports = router;