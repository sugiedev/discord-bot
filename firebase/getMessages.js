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

  // Firestore クエリを作成
  const query = db
    .collection("messages")
    .where("createdAt", ">=", startOfDay)
    .where("createdAt", "<=", endOfDay);

  // クエリを実行してメッセージを取得
  const snapshot = await query.get();

  // メッセージを処理
  const results = []; // 空の配列を作成

  snapshot.forEach((doc) => {
    const data = doc.data(); // ドキュメントのデータを取得
    results.push(data); // 配列にデータを追加
  });

  return results; // 配列をreturn
}

module.exports = getMessages;
