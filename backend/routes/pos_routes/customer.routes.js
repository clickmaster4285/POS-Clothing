const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const checkPermission = require("../../middlewares/checkPermission");
const { PERMISSIONS_OBJECT } = require("../../config/permissions");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,

} = require("../../controllers/pos_controllers/customer.controller");

// POS Customer Management permissions
const CUSTOMER_PERMISSIONS = PERMISSIONS_OBJECT.POINT_OF_SALE.CUSTOMER_INFORMATION;

// Apply auth middleware globally
router.use(auth);

// Get all customers
router.get(
  "/",
  checkPermission([CUSTOMER_PERMISSIONS.READ]),
  getCustomers
);

// Get a specific customer by ID
router.get(
  "/:id",
  checkPermission([CUSTOMER_PERMISSIONS.READ]),
  getCustomerById
);

// Create a new customer
router.post(
  "/",
  checkPermission([CUSTOMER_PERMISSIONS.CREATE]),
  createCustomer
);

// Update an existing customer
router.put(
  "/:id",
  checkPermission([CUSTOMER_PERMISSIONS.UPDATE]),
  updateCustomer
);

// Toggle (activate/deactivate) a customer
router.delete(
  "/:id",
  checkPermission([CUSTOMER_PERMISSIONS.UPDATE]), // toggling status is considered an update
  toggleCustomerStatus
);


module.exports = router;