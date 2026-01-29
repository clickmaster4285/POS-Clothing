const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  toggleBranchStatus
} = require("../controllers/branch.controller");


router.post("/", auth, createBranch);

router.get("/", auth, getAllBranches);

router.get("/:id", auth, getBranchById);

router.put("/:id", auth, updateBranch);

router.delete("/:id", auth, toggleBranchStatus);

module.exports = router;
