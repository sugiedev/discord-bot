const { db } = require("./firebase.js");

async function getMessages(dateNum) {
  const dateString = dateNum.toString();
  const date = new Date(
    parseInt(dateString.substring(0, 4)), // 年
    parseInt(dateString.substring(4, 6)) - 1, // 月
    parseInt(dateString.substring(6, 8)) // 日
  );

  // 指定された日付の始まりと終わりを計算
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const query = db
    .collection("messages")
    .where("createdAt", ">=", startOfDay)
    .where("createdAt", "<=", endOfDay);

  const snapshot = await query.get();
  const msgs = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    msgs.push(data);
  });

  return msgs;
}

module.exports = getMessages;
