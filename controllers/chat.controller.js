import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
console.log("DeepSeek API Key:", DEEPSEEK_API_KEY);

const sujetsAutorises = [
  'réservation', 'reservation',
  'cours', 'coach',
  'sport', 'salle', 'gym',
  'musculation', 'muscu',
  'fitness', 'cardio',
  'équipement', 'equipement',
  'horaires', 'horaire', 'heure', 'quand',
  'planning', 'disponibilité', 'disponibilite',
  'entraînement', 'entrainement', 'entraine',
  'programme', 'fréquence', 'frequence',
  'combien', 'fois', 'séances', 'seances',
  'conseil', 'proposition', 'suggestion'
];

export const chatWithBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "❗ Veuillez fournir un message." });
  }

  const messageClean = message
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, '');

  const isValid = sujetsAutorises.some(mot => {
    const motClean = mot.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return messageClean.includes(motClean);
  });

  if (!isValid) {
    return res.status(400).json({ reply: "❌ Désolé, je ne peux répondre qu'à des questions liées à la salle de sport." });
  }

  try {
    // Essayer avec DeepSeek d'abord
    const aiReply = await generateAIResponseWithDeepSeek(message);
    if (aiReply && aiReply.length > 5) {
      return res.json({ reply: aiReply });
    }

    // Fallback manuel si la réponse est vide ou étrange
    const fallbackReply = generateManualReply(messageClean);
    return res.json({ reply: fallbackReply });

  } catch (error) {
    console.error("Erreur avec DeepSeek:", error);
    const fallbackReply = generateManualReply(messageClean);
    return res.json({ reply: fallbackReply });
  }
};



async function generateAIResponseWithDeepSeek(message) {
    try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions', 
          {
            model: "deepseek/deepseek-chat", 
            messages: [
              {
                role: "system",
                content: "Tu es un assistant expert pour une salle de sport. Réponds de manière concise en 2-3 phrases maximum."
              },
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 150
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, 
              'HTTP-Referer': 'http://localhost:3000', 
              'X-Title': 'Fitness Assistant', 
              'Content-Type': 'application/json'
            },
            timeout: 5000
          }
        );
    
        if (!response.data?.choices?.[0]?.message?.content) {
          console.error("Réponse inattendue:", response.data);
          return null;
        }
    
        return response.data.choices[0].message.content.trim();
    
      } catch (error) {
        console.error("Erreur OpenRouter:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        return null;
      }
    }
  



function generateManualReply(messageClean) {
    if (messageClean.includes("horaire") || messageClean.includes("heure")) {
      return "🏋️ Horaires : Lundi-Vendredi 6h-22h, Samedi 8h-20h, Dimanche 9h-18h.";
    }
  
    if (messageClean.includes("combien") && messageClean.includes("fois")) {
      return "📅 3 à 5 séances par semaine sont idéales selon ton niveau et objectifs.";
    }
  
    if (messageClean.includes("proposition") || messageClean.includes("suggestion")) {
      return "💡 Tu peux commencer par du cardio léger suivi d’une séance de muscu. Tu veux un exemple de programme ?";
    }
  
    return "🤖 Je suis là pour t’aider avec tes questions sportives ! Pose-moi une question sur les cours, coachs, réservations ou équipements.";
  }
  
