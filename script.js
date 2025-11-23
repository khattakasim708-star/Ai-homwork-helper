let selectedSubject = null;
let mode = "homework";

// Toggle mode buttons
document.querySelectorAll(".mode-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".mode-btn").forEach(b=>{
      b.classList.remove("active");
      b.classList.add("inactive");
    });
    btn.classList.add("active");
    btn.classList.remove("inactive");
    mode = btn.dataset.mode;
  });
});

// Select subject
document.querySelectorAll(".subject").forEach(sub=>{
  sub.addEventListener("click", ()=>{
    document.querySelectorAll(".subject").forEach(s=>s.style.border="none");
    sub.style.border="2px solid #fff";
    selectedSubject = sub.innerText;
  });
});

// Copy button
const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", ()=>{
  const text = document.getElementById("answerBox").innerText;
  navigator.clipboard.writeText(text);
  alert("Answer copied!");
});

// Submit button
document.querySelector(".submit-btn").addEventListener("click", async ()=>{
  const question = document.getElementById("ask").value.trim();
  const answerBox = document.getElementById("answerBox");

  if(!question){ answerBox.innerText="❌ Please type a question."; return; }
  if(!selectedSubject){ answerBox.innerText="❌ Please select a subject."; return; }

  answerBox.innerText = "✨ AI is thinking...";

  try{
    const res = await fetch("/api/ask", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ question, subject: selectedSubject, mode })
    });

    const data = await res.json();
    if(data.answer){
      answerBox.innerText = data.answer;
    } else {
      answerBox.innerText = "❌ Failed to get answer";
    }
  } catch(err){
    answerBox.innerText = "❌ Error connecting to server";
    console.error(err);
  }
});