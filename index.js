const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const jquery = require("jquery");
app.listen(8887);

const getBoard = async URL => {
  try {
    return await axios.get(URL);
  } catch (e) {
    console.log(err);
  }
};

const SWBoardURL = "https://computer.cnu.ac.kr/computer/notice/project.do";
const NormalBoardURL = "https://computer.cnu.ac.kr/computer/notice/notice.do";
const DepartmentBoardURL ="https://computer.cnu.ac.kr/computer/notice/bachelor.do";

var admin = require("firebase-admin");
var serviceAccount = require("./cseboard-firebase-adminsdk-cc8fk-5273295aa7.json");
const myToken =
  "dwajJLySzmU:APA91bGLswQwREe0A1GxN_n3PE1-5RfHzMRGK0a_OzNEXx866Gtq3RxbKmb6h2gHhkrGY8-jXqIIEGIz3CJ_ZCY9N1eM0Mj6KhH8M8GsnHnhLhz2S3qhg21qT_yWQGZOkgMvYptrRcrZ";

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};
async function start() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cseboard.firebaseio.com"
  });
  let nowboard = await startSWApp(SWBoardURL);
  let latestboard = nowboard;
  setInterval(async () => {
    nowboard = await startSWApp(SWBoardURL);
    if (nowboard !== latestboard) {
      console.log("다름");
    } else {
      admin
        .messaging()
        .sendToDevice(
          myToken,
          {
            notification: {
              title: "새로운 게시물이 있습니다",
              body: nowboard
            }
          },
          options
        )
        .then(res => console.log("result", res));
      latestboard = nowboard;
    }
  }, 5000);
}

async function startSWApp(URL) {
  var result = await getBoard(URL);
  const $ = cheerio.load(result.data);
  const table = $(".board-table");
  var $postName = table
    .children("tbody")
    .children("tr")
    .children("td.b-td-left")
    .children("div.b-title-box")
    .children("a");
  return $postName.get(0).attribs.title;
}

start();
