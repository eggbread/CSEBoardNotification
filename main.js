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
const { app, BrowserWindow } = require("electron");
let win;
let child;
function createWindow() {
  // 브라우저 창을 생성합니다.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame:false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // 개발자 도구를 엽니다.
  win.webContents.openDevTools();

  // 창이 닫힐 때 발생합니다
  win.on("closed", () => {
    // window 객체에 대한 참조해제. 여러 개의 창을 지원하는 앱이라면
    // 창을 배열에 저장할 수 있습니다. 이곳은 관련 요소를 삭제하기에 좋은 장소입니다.
    win = null;
  });
  win.on;
}

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on("ready", createWindow);

// 모든 창이 닫혔을 때 종료.
app.on("window-all-closed", () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (win === null) {
    createWindow();
  }
});

function startSWApp() {
  getBoard(SWBoardURL).then(result => {
    var boardList = [];
    const $ = cheerio.load(result.data);
    var SWTable = document.getElementById("SWTable");
    const table = $(".board-table");
    var $postName = table
      .children("tbody")
      .children("tr")
      .children("td.b-td-left")
      .children("div.b-title-box")
      .children("a");
    for (var i = 0; i < 5; i++) {
      boardList[i] = {
        title: $postName.get(i).attribs.title,
        url: SWBoardURL + $postName.get(i).attribs.href
      };
      jquery("#SWTable").append(
        "<tr><td>" +
          (i + 1) +
          "</td><td onclick=openModal('" +
          boardList[i].url +
          "')>" +
          boardList[i].title +
          "</td></tr>"
      );
    }

    console.log(boardList);
  });
}

function startDepartmentApp() {
  getBoard(DepartmentBoardURL).then(result => {
    var boardList = [];
    const $ = cheerio.load(result.data);
    var SWTable = document.getElementById("SWTable");
    const table = $(".board-table");
    var $postName = table
      .children("tbody")
      .children("tr")
      .children("td.b-td-left")
      .children("div.b-title-box")
      .children("a");
    for (var i = 0; i < 5; i++) {
      boardList[i] = {
        title: $postName.get(i).attribs.title,
        url: DepartmentBoardURL + $postName.get(i).attribs.href
      };
      jquery("#DepartmentTable").append(
        "<tr><td>" +
          (i + 1) +
          "</td><td onclick=openModal('" +
          boardList[i].url +
          "')>" +
          boardList[i].title +
          "</td></tr>"
      );
    }

    console.log(boardList);
  });
}

function startNormalApp() {
  getBoard(NormalBoardURL).then(result => {
    var boardList = [];
    const $ = cheerio.load(result.data);
    var SWTable = document.getElementById("SWTable");
    const table = $(".board-table");
    var $postName = table
      .children("tbody")
      .children("tr")
      .children("td.b-td-left")
      .children("div.b-title-box")
      .children("a");
    for (var i = 0; i < 5; i++) {
      boardList[i] = {
        title: $postName.get(i).attribs.title,
        url: NormalBoardURL + $postName.get(i).attribs.href
      };
      jquery("#NormalTable").append(
        "<tr><td>" +
          (i + 1) +
          "</td><td onclick=openModal('" +
          boardList[i].url +
          "')>" +
          boardList[i].title +
          "</td></tr>"
      );
    }

    console.log(boardList);
  }).then(()=>{
    const notification = {
        title: 'BTC Alert',
        body: 'BTC just beat your target price!'
    }
    const myNotification = new window.Notification(notification.title, notification)
  });
}

function openModal(url) {
    message()
  const electron = require("electron");
  const BrowserWindow = electron.remote.BrowserWindow;
  child = new BrowserWindow({ parent: win, modal: true, show: false });
  child.loadURL(url);
  child.once("ready-to-show", () => {
    child.show();
  });
}

function message(){
    alert("Hi")
    const notification = {
        title: 'BTC Alert',
        body: 'BTC just beat your target price!'
    }
    const myNotification = new window.Notification(notification.title, notification)
}