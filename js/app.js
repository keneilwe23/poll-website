const socket = new WebSocket(
  "wss://zpxfdq7u6f.execute-api.us-east-1.amazonaws.com/production/"
);

socket.onopen = () => {
  console.log("WebSocket connected");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Broadcast received:", data);

    //Update UI with live results
  if (data.votes && polls[currentPollIndex]) {
    let current = polls[currentPollIndex];
    current.answersWeight = current.answers.map(
      a => data.votes[a] || 0
    );
    current.pollCount = current.answersWeight.reduce((a,b) => a + b, 0);
    showResults();
  }
};

socket.onerror = (err) => {
  console.error("WebSocket error:", err);
};

socket.onclose = () => {
  console.log("WebSocket disconnected");
};

let polls = [
  {
    question:"What's your favorite snack?",
    answers:["Chocolate", "Cupcakes", "Donuts", "Brownies"],
    pollCount:20,
    answersWeight:[4, 4, 2, 10],
    selectedAnswer:-1
  },
  {
    question:"What's your favorite movie?",
    answers:["Action", "Comedy", "Drama", "Horror"],
    pollCount:20,
    answersWeight:[8, 5, 4, 3],
    selectedAnswer:-1
  }
];

let currentPollIndex = 0;
let poll = polls[currentPollIndex];

let pollDOM = {
  question:document.querySelector(".poll .question"),
  answers:document.querySelector(".poll .answers")
};

loadPoll();

function loadPoll(){
  poll = polls[currentPollIndex];
  pollDOM.question.innerText = poll.question;
  pollDOM.answers.innerHTML = poll.answers.map(function(answer,i){
    return (
      `
        <div class="answer ${poll.selectedAnswer === i ? 'selected' : ''}" onclick="markAnswer('${i}')">
          ${answer}
          <span class="percentage-bar"></span>
          <span class="percentage-value"></span>
        </div>
      `
    );
  }).join("");
  
  if(poll.selectedAnswer !== -1){
    showResults();
  }
  
  updateButtonVisibility();
}

function markAnswer(i){
  poll.selectedAnswer = +i;
  try {
    document.querySelector(".poll .answers .answer.selected").classList.remove("selected");
  } catch(msg){}
  document.querySelectorAll(".poll .answers .answer")[+i].classList.add("selected");

  //SEND VOTE VIA WEBSOCKET
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      action: "sendVote",
      pollId: "num101",
      option: poll.answers[i]
    }));
  }

  showResults();
}

function showResults(){
  let answers = document.querySelectorAll(".poll .answers .answer");
  for(let i=0;i<answers.length;i++){
    let votes = 0;
    let percentage = 0;
    if(i == poll.selectedAnswer){
      votes = poll.answersWeight[i] + 1;
      percentage = Math.round(
        (poll.answersWeight[i]+1) * 100 / (poll.pollCount+1)
      );
    } else {
      votes = poll.answersWeight[i];
      percentage = Math.round(
        (poll.answersWeight[i]) * 100 / (poll.pollCount+1)
      );
    }
    
    answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
    answers[i].querySelector(".percentage-value").innerText = votes;
  }
}

function nextPoll(){
  if(currentPollIndex < polls.length - 1){
    currentPollIndex++;
    loadPoll();
  }
}

function prevPoll(){
  if(currentPollIndex > 0){
    currentPollIndex--;
    loadPoll();
  }
}

function updateButtonVisibility(){
  let prevBtn = document.querySelector(".prev-btn");
  let nextBtn = document.querySelector(".next-btn");
  
  if(currentPollIndex === 0){
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }
  
  if(currentPollIndex === polls.length - 1){
    nextBtn.innerText = "Done";
    nextBtn.onclick = function(){
      if(poll.selectedAnswer !== -1){
        showCompletion();
      } else {
        alert("Please select an answer before finishing!");
      }
    };
  } else {
    nextBtn.innerText = "Next";
    nextBtn.onclick = function(){ nextPoll(); };
  }
}

function showCompletion(){
  document.querySelector(".poll").style.display = "none";
  document.getElementById("completionMessage").style.display = "block";
  
  let summary = "<div class='summary-list'>";
  polls.forEach(function(p){
    if(p.selectedAnswer !== -1){
      summary += `
        <div class="summary-item">
          <strong>${p.question}</strong><br>
          You answered: <span class="answer-highlight">${p.answers[p.selectedAnswer]}</span>
        </div>
      `;
    }
  });
  summary += "</div>";
  
  document.querySelector(".poll-summary").innerHTML = summary;
}

function restartPolls(){
  polls.forEach(function(p){
    p.selectedAnswer = -1;
  });
  currentPollIndex = 0;
  document.querySelector(".poll").style.display = "block";
  document.getElementById("completionMessage").style.display = "none";
  loadPoll();
}

function startSurvey(){
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("pollContainer").style.display = "block";
  loadPoll();
}
