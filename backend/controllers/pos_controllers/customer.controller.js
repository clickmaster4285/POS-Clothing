// controllers/pos_controllers/customer.controller.js
const Customer = require("../../models/pos_model/customer.model");

// GET all active customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isActive: true });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE customer
const createCustomer = async (req, res) => {
  try {
    const { firstName, email, phonePrimary, ...rest } = req.body;
    const customerId = `CUST-${Math.floor(10000 + Math.random() * 90000)}`;
    const loyaltyCardNumber = `LYL-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const customer = new Customer({
      firstName,
      phonePrimary,
      email,
      customerId,
      loyaltyCardNumber,
        loyaltyPoints: 0,      
  redeemedPoints: 0, 
      ...rest,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE customer
const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE customer
const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    customer.isActive = !customer.isActive;
    await customer.save();
    res.json({ message: "Customer status updated", customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,
};
