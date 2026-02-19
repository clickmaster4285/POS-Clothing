const Terminal = require("../../models/terminal.model");
const User = require("../../models/User"); // your user model
const User = require("../../models/User"); // your user model
// ─── Create a new terminal ─────────────────────────────
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
    const { terminalId } = req.params;
    const { userId, role } = req.body;

    const terminal = await Terminal.findOne({ terminalId });
    if (!terminal) return res.status(404).json({ success: false, message: "Terminal not found" });

    const roleRef = role === "employee" ? "User" : "Supplier";

    if (terminal.users.some(u => u.userId.equals(userId))) {
      return res.status(400).json({ success: false, message: "User already assigned to terminal" });
    }

    terminal.users.push({ userId, role, roleRef });
    await terminal.save();

    res.status(200).json({ success: true, data: terminal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Remove user from terminal ──────────────────────────
exports.removeUserFromTerminal = async (req, res) => {
  try {
    const { terminalId, userId } = req.params;

    const terminal = await Terminal.findOne({ terminalId });
    if (!terminal) return res.status(404).json({ success: false, message: "Terminal not found" });

    terminal.users = terminal.users.filter(u => !u.userId.equals(userId));
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
    const { terminalId } = req.params;

    const terminal = await Terminal.findOne({ terminalId })
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
