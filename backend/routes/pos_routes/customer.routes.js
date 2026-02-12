const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,
} = require("../../controllers/pos_controllers/customer.controller");

router.use(auth);

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", toggleCustomerStatus);

module.exports = router;
