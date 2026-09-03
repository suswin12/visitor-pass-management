const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, "Visitor name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    company: {
      type: String,
      trim: true,
    },

    idProofType: {
      type: String,
      enum: ["Aadhar", "Passport", "Driving License", "Voter ID", "Other"],
      required: [true, "ID proof type is required"],
    },

    idProofNumber: {
      type: String,
      required: [true, "ID proof number is required"],
      trim: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
    },

    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },

    expectedArrival: {
      type: Date,
      required: [true, "Expected arrival time is required"],
    },

    purpose: {
      type: String,
      required: [true, "Purpose of visit is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      default: "pending",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required"],
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Visitor", visitorSchema);
