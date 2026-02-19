const Terminal = require("../models/terminal.model");
const User = require("../models/user.model");
const Supplier = require('../models/supplier.model');
const mongoose = require("mongoose");


exports.createTerminal = async (req, res) => {
  try {
    const { terminalId, terminalName, branch, location } = req.body;

    const existing = await Terminal.findOne({ terminalId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Terminal already exists" });
    }

    const terminal = new Terminal({
      terminalId,
      terminalName,
      branch,
      location,
      users: [],
      actions: [],
    });

    await terminal.save();
    res.status(201).json({ success: true, data: terminal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Add user to terminal ───────────────────────────────
exports.addUserToTerminal = async (req, res) => {
  try {
   
    const { id } = req.params; 
    let { userId, role } = req.body;

    if (!['employee', 'supplier'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

   
    const terminal = await Terminal.findById(id);
    
    if (!terminal) {
      console.log("Terminal not found with _id:", id);
      return res.status(404).json({ success: false, message: "Terminal not found" });
    }

    console.log("User Already exists:", terminal.terminalName, terminal._id);

    
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
  const userExists = terminal.users.some(u =>
  new mongoose.Types.ObjectId(u.userId).equals(userIdObj)
);

if (userExists) {
  return res.status(400).json({
    success: false,
    message: "User already exists in this terminal"
  });
}

    
    if (role === "employee") {
      const user = await mongoose.model("User").findById(userIdObj);
      if (!user) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
   
    } else if (role === "supplier") {
      const supplier = await mongoose.model("Supplier").findById(userIdObj);
      if (!supplier) {
        return res.status(404).json({ success: false, message: "Supplier not found" });
      }
      
    }

    const roleRef = role === "employee" ? "User" : "Supplier";

    // Add the user to the terminal
    terminal.users.push({ 
      userId: userIdObj, 
      role, 
      roleRef 
    });

    
    
    // Mark the users array as modified (helps with nested arrays)
    terminal.markModified('users');
    
    // Save the terminal
    const savedTerminal = await terminal.save();
   

    // Populate the user details
    const populatedTerminal = await Terminal.findById(id)
      .populate({
        path: 'users.userId',
        select: role === "employee" ? 'firstName lastName email' : 'company_name email supplier_id',
        refPath: 'users.roleRef'
      });

    res.status(200).json({ success: true, data: populatedTerminal });
  } catch (err) {
    console.error("Error in addUserToTerminal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Remove user from terminal ──────────────────────────
exports.removeUserFromTerminal = async (req, res) => {
  try {
    const { id, userId } = req.params;

    console.log("Removing user from terminal with id:", id, "and userId:", userId);

    const terminal = await Terminal.findById(id);
    if (!terminal) {
      return res.status(404).json({ success: false, message: "Terminal not found" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    terminal.users = terminal.users.filter(
      u => !u.userId.equals(userIdObj)
    );

    terminal.markModified('users'); // important for nested array
    await terminal.save();

    res.status(200).json({ success: true, data: terminal });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Record an action ───────────────────────────────────
exports.recordAction = async (req, res) => {
  try {
    const { terminalId } = req.params;
    const { userId, role, actionType, description, metadata } = req.body;

    const terminal = await Terminal.findOne({ terminalId });
    if (!terminal) return res.status(404).json({ success: false, message: "Terminal not found" });

    const roleRef = role === "employee" ? "User" : "Supplier";

    terminal.actions.push({
      userId,
      role,
      roleRef,
      actionType,
      description,
      metadata,
    });

    await terminal.save();
    res.status(200).json({ success: true, data: terminal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ─── Get terminal info with users and history ──────────
exports.getTerminal = async (req, res) => {
  try {
    const { id } = req.params;

    const terminal = await Terminal.findOne({ _id: id })
      .populate("users.userId", "firstName lastName role")
      .populate("actions.userId", "firstName lastName role");

    if (!terminal) return res.status(404).json({ success: false, message: "Terminal not found" });

    res.status(200).json({ success: true, data: terminal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── List all terminals ────────────────────────────────
exports.listTerminals = async (req, res) => {
  try {
    const terminals = await Terminal.find()
      .populate("users.userId", "firstName lastName role")
      .populate("actions.userId", "firstName lastName role");

    res.status(200).json({ success: true, data: terminals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
