const { db } = require("./firebase.js");

async function getMessages(dateNum) {
  const dateString = dateNum.toString();
  const date = new Date(
    parseInt(dateString.substring(0, 4)),
    parseInt(dateString.substring(4, 6)) - 1,
    parseInt(dateString.substring(6, 8))
  );

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const query = db
    .collection("messages")
    .orderBy("createdAt", "asc")
    .startAt(startOfDay)
    .endAt(endOfDay);

  const snapshot = await query.get();

  const messages = snapshot.docs.map((doc) => doc.data());
  return messages;
}

module.exports = getMessages;
