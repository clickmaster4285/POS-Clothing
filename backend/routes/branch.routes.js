const express = require("express");
const router = express.Router();

const auth = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const PERMISSIONS = require('../config/permissions');


const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  toggleBranchStatus
} = require("../controllers/branch.controller");


router.post("/", auth,checkPermission(PERMISSIONS.BRANCHES.CREATE), createBranch);

router.get("/", auth, checkPermission(PERMISSIONS.BRANCHES.READ),getAllBranches);

router.get("/:id", checkPermission(PERMISSIONS.BRANCHES.READ),auth, getBranchById);

router.put("/:id", auth, checkPermission(PERMISSIONS.BRANCHES.UPDATE), updateBranch);

router.delete("/:id", auth, checkPermission(PERMISSIONS.BRANCHES.DELETE), toggleBranchStatus);

module.exports = router;
