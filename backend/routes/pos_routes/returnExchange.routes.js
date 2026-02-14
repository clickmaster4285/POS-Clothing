const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const returnExchangeController = require("../../controllers/pos_controllers/returnExchange.controller");

router.use(auth);

// Get all return/exchange transactions
router.get("/", returnExchangeController.getAllReturnExchanges);

// Get al
// l return/exchange for a specific original transaction
router.get("/original/:originalTransactionId", returnExchangeController.getByOriginalTransaction);

// Create a new return/exchange
router.post("/create", returnExchangeController.createReturnExchange);

// Void a return/exchange
router.patch("/void/:id", returnExchangeController.voidReturnExchange);

// Update a return/exchange (payment adjustment, notes, etc.)
router.patch("/update/:id", returnExchangeController.updateReturnExchange);


router.get("/detail/:id", returnExchangeController.getTransactionFullDetails);



module.exports = router;
