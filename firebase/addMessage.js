const { db } = require("./firebase.js");

async function addMessage(id, data) {
  try {
    await db
      .collection("messages")
      .doc(id)
      .set({
        ...data,
      });
  } catch (e) {
    throw e;
  }
}

module.exports = addMessage;
