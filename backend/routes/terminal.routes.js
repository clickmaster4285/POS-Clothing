const express = require("express");
const router = express.Router();
const terminalCtrl = require("../../controllers/pos_controllers/terminalController");

// Terminal CRUD
router.post("/", terminalCtrl.createTerminal);
router.get("/", terminalCtrl.listTerminals);
router.get("/:terminalId", terminalCtrl.getTerminal);

// Manage users
router.post("/:terminalId/users", terminalCtrl.addUserToTerminal);
router.delete("/:terminalId/users/:userId", terminalCtrl.removeUserFromTerminal);

// Record actions
router.post("/:terminalId/actions", terminalCtrl.recordAction);

module.exports = router;
