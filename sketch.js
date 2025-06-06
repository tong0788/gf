let handpose;
let video;
let predictions = [];
let startButton = { x: 200, y: 200, w: 150, h: 50 };
let gameStarted = false;
let startTime;
let currentQuestionIndex = 0;
let score = 0;
let showResult = false;
let resultMessage = "";
let resultTimer = 0;
let questionTimer = 0;
let questions = [
  {
    text: "教育科技在未來十年最有可能改變哪一項教學元素？",
    options: ["A. 學科內容本身", "B. 教師的角色與教學方式", "C. 教室的地板設計"],
    answer: "B",
  },
  {
    text: "下列哪一項是虛擬實境（VR）與擴增實境（AR）在教育現場應用時常見的挑戰？",
    options: ["A. 學生對科技失去興趣", "B. 教材難以轉換為科技內容", "C. 設備與技術成本高"],
    answer: "C",
  },
  {
    text: "數位落差對學生有什麼主要影響？",
    options: ["A. 提高成績一致性", "B. 強化群體合作能力", "C. 造成學習機會與成果的不平等"],
    answer: "C",
  },
  {
    text: "人工智慧在教育中的一項潛在貢獻是什麼？",
    options: ["A. 自動安排課堂座位", "B. 提供個別化的學習路徑", "C. 取代學校行政人員"],
    answer: "B",
  },
  {
    text: "關於線上學習平台（如 Coursera、edX），下列何者為其可能的正向影響？",
    options: ["A. 增加學生分心機率", "B. 降低教學內容的深度", "C. 提供更多元且彈性的學習機會"],
    answer: "C",
  },
  {
    text: "遊戲化學習最主要的優點是什麼？",
    options: ["A. 讓學生輕鬆獲得分數", "B. 提升學生的學習動機與參與感", "C. 減少老師的工作量"],
    answer: "B",
  },
  {
    text: "為了提升教科系學生的職場競爭力，下列何者最為重要？",
    options: ["A. 熟悉紙本教材編輯", "B. 具備跨領域能力，如程式設計與設計思維", "C. 專注於單一教育理論的研究"],
    answer: "B",
  },
  {
    text: "在數位學習的時代，教師與教育科技專業人員之間應如何互動？",
    options: ["A. 教師應完全交由科技人員負責教學內容", "B. 教師與科技人員應建立合作關係並共同設計學習資源", "C. 教師可忽略科技發展，專注於教學經驗"],
    answer: "B",
  },
];

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => console.log("Model loaded"));
  handpose.on("predict", (results) => (predictions = results));
}

function draw() {
  background(220);

  // 顯示右上角秒數計時器
  displayTimer();

  // 顯示視窗正中間的文字 "TKUET"
  displayCenterText();

  if (!gameStarted) {
    drawStartButton();
    checkStartButtonCollision();
  } else {
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
      checkAnswerCollision();
    } else {
      displayResults();
    }
  }

  if (showResult && millis() - resultTimer > 1000) {
    showResult = false;
    currentQuestionIndex++;
  }
}

function drawStartButton() {
  fill(0, 255, 0);
  rect(startButton.x, startButton.y, startButton.w, startButton.h);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("開始遊戲", startButton.x + startButton.w / 2, startButton.y + startButton.h / 2);
}

function checkStartButtonCollision() {
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexFinger = hand.annotations.indexFinger[3];
    if (
      indexFinger[0] > startButton.x &&
      indexFinger[0] < startButton.x + startButton.w &&
      indexFinger[1] > startButton.y &&
      indexFinger[1] < startButton.y + startButton.h
    ) {
      gameStarted = true;
      startTime = millis();
    }
  }
}

function displayQuestion() {
  let question = questions[currentQuestionIndex];
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`題目 ${currentQuestionIndex + 1}: ${question.text}`, 50, 50);

  for (let i = 0; i < question.options.length; i++) {
    let x = random(100, width - 100);
    let y = random(150, height - 100);
    fill(255, 0, 0);
    ellipse(x, y, 50);
    fill(0);
    text(question.options[i], x - 20, y + 30);
  }
}

function checkAnswerCollision() {
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexFinger = hand.annotations.indexFinger[3];
    let question = questions[currentQuestionIndex];

    for (let i = 0; i < question.options.length; i++) {
      let x = random(100, width - 100);
      let y = random(150, height - 100);
      let d = dist(indexFinger[0], indexFinger[1], x, y);
      if (d < 25) {
        if (question.options[i][0] === question.answer) {
          resultMessage = "正確！";
          score++;
        } else {
          resultMessage = "錯誤！";
        }
        showResult = true;
        resultTimer = millis();
      }
    }
  }
}

function displayResults() {
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  let totalTime = ((millis() - startTime) / 1000).toFixed(2);
  text(`遊戲結束！總分：${score} 分`, width / 2, height / 2 - 20);
  text(`完成時間：${totalTime} 秒`, width / 2, height / 2 + 20);
}

// 顯示右上角秒數計時器
function displayTimer() {
  fill(0);
  textSize(16);
  textAlign(RIGHT, TOP);
  let elapsedTime = gameStarted ? ((millis() - startTime) / 1000).toFixed(2) : "0.00";
  text(`時間：${elapsedTime} 秒`, width - 10, 10);
}

// 顯示視窗正中間的文字 "TKUET"
function displayCenterText() {
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("TKUET", width / 2, height / 2);
}