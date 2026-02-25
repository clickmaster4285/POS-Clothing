// controllers/pos_controllers/customer.controller.js
const Customer = require("../../models/pos_model/customer.model");
const { Transaction } = require("../../models/pos_model/transaction.model");

const mongoose = require("mongoose");
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
 

    const { firstName, email, phonePrimary, branch, ...rest } = req.body;

    if (!firstName || !email || !phonePrimary) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const user = req.user;
    let finalBranchId;

   

    // ✅ ROLE BASED BRANCH ASSIGNMENT
    if (user.role === "admin") {
      // Admin must provide branch from frontend
      if (!branch) {
        return res.status(400).json({ error: "Branch is required for admin" });
      }
      finalBranchId = branch;
    } else if (user.role === "manager") {
      // Manager uses their assigned branch from token
      if (!user.branch_id) {
        return res.status(400).json({ error: "Manager has no assigned branch" });
      }
      finalBranchId = user.branch_id;
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

 

    // ✅ CHECK IF EMAIL ALREADY EXISTS
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // ✅ GENERATE IDS
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
      branch: finalBranchId,
      ...rest,
    });

    await customer.save();

    res.status(201).json(customer);

  } catch (err) {
    console.error("Error in createCustomer:", err);
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
