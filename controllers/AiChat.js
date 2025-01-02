require('dotenv').config();
const Groq = require('groq-sdk');

const AiChat=async(req,res)=>{
    try{
    const message=req.body.message;
    console.log("message gotten from the cleint",message)
    const apiKey=process.env.GROQ_API_KEY;
    
    const groq=new Groq({ apiKey: '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' });
    if(!message){
        res.status(500).json({error:"No quarey got "});
    }
    console.log("working till now ")
    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 300,
    });
    const aiMessage = response.choices[0]?.message?.content || "No response generated.";
    console.log("responce from mete",aiMessage)
    res.status(200).json({aiMessage})

    

    }
    catch(error){
        res.status(500).json({error:"an error occured while your request was processing "});
    }
    
}

module.exports=AiChat;