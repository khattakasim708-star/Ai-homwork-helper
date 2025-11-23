import fetch from "node-fetch";

export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });

  const { question, subject, mode } = req.body;
  if(!question || !subject || !mode) return res.status(400).json({ error:"Missing parameters" });

  try{
    const response = await fetch("https://api.gemini.google.com/v1beta/generateText", {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        prompt: `${mode === "exam" ? "[Exam Prep]" : "[Homework]"} Question: ${question} Subject: ${subject} Short and meaningful answer, credit ASIM DEVELOPER.`,
        maxOutputTokens: 200
      })
    });

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content || "No answer returned";
    res.status(200).json({ answer });

  } catch(err){
    console.error(err);
    res.status(500).json({ error:"Error fetching Gemini API" });
  }
}
