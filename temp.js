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
const DepartmentBoardURL =
  "https://computer.cnu.ac.kr/computer/notice/bachelor.do";

var admin = require('firebase-admin');
var serviceAccount = require("./cseboard-firebase-adminsdk-cc8fk-5273295aa7.json");
const myToken = "dwajJLySzmU:APA91bGLswQwREe0A1GxN_n3PE1-5RfHzMRGK0a_OzNEXx866Gtq3RxbKmb6h2gHhkrGY8-jXqIIEGIz3CJ_ZCY9N1eM0Mj6KhH8M8GsnHnhLhz2S3qhg21qT_yWQGZOkgMvYptrRcrZ";
// var temp=admin.initializeApp({
//   credential:admin.credential.cert(serviceAccount),
//   databaseURL:"https://cseboard.firebaseio.com"
// })

// var payload = {
//   notification: {
//     title: "새로운 게시물이 있습니다",
//     body: data
//   }
// };

var options = {
  priority: "high",
  timeToLive: 60 * 60 *24
};
async function start(){
  admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://cseboard.firebaseio.com"
  })
  let nowboard = await startSWApp(SWBoardURL);
  let latestboard = nowboard;
  setInterval(async ()=>{
        console.log("now",nowboard)
        console.log("la",latestboard)
        nowboard=await startSWApp(SWBoardURL)
        if(nowboard!==latestboard){
          console.log("다름")
        }else{
          admin.messaging().sendToDevice(myToken,{
                notification: {
                  title: "새로운 게시물이 있습니다",
                  body: "$postName.get(0).attribs.title"
                }
              },options).then(res=>console.log("result",res))
        }
      
      },3000)
}

// nowboard=startSWApp(SWBoardURL).then(res=>{
//   return res;
// })

// startSWApp(SWBoardURL).then(res=>{
//   let latestboard=res
//   console.log(nowboard)
//   setInterval(()=>{
//     console.log("now",nowboard)
//     console.log("la",latestboard)
//     startSWApp(SWBoardURL)
//     if(nowboard!==latestboard){
//       console.log("다름")
//     }else{
//       console.log("같음")
//     }
  
//   },5000)

// })
// let latestboard=nowboard
// console.log(nowboard)
// console.log("la",latestboard)

async function startSWApp( URL) {
  var result= await getBoard(URL)
  const $ = cheerio.load(result.data);
  const table = $(".board-table");
    var $postName = table
      .children("tbody")
      .children("tr")
      .children("td.b-td-left")
      .children("div.b-title-box")
      .children("a");
  return $postName.get(0).attribs.title;
  // return getBoard(URL).then( result => {
  //   var boardList = [];
  //   const $ = cheerio.load(result.data);
  //   // var SWTable = document.getElementById("SWTable");
  //   const table = $(".board-table");
  //   var $postName = table
  //     .children("tbody")
  //     .children("tr")
  //     .children("td.b-td-left")
  //     .children("div.b-title-box")
  //     .children("a");
  //   // for (var i = 0; i < 5; i++) {
  //   //   boardList[i] = {
  //   //     title: $postName.get(i).attribs.title,
  //   //     url: SWBoardURL + $postName.get(i).attribs.href
  //   //   };
  //   //   jquery("#SWTable").append(
  //   //     "<tr><td>" +
  //   //       (i + 1) +
  //   //       "</td><td onclick=openModal('" +
  //   //       boardList[i].url +
  //   //       "')>" +
  //   //       boardList[i].title +
  //   //       "</td></tr>"
  //   //   );
  //   // }
  //   // return $postName.get(0).attribs.title;
  //   // admin.messaging().sendToDevice(myToken,{
  //   //   notification: {
  //   //     title: "새로운 게시물이 있습니다",
  //   //     body: $postName.get(0).attribs.title
  //   //   }
  //   // },options).then(res=>console.log("result",res))
  //   // console.log($postName.get(0).attribs.title)
  //   return $postName.get(0).attribs.title
    
  // });
  // console.log(now)
}

start()