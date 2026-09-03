const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
  action,
  visitor,
  performedBy,
  details = "",
}) => {
  try {
    return await ActivityLog.create({
      action,
      visitor,
      performedBy,
      details,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
    return null;
  }
};

module.exports = {
  createActivityLog,
};
