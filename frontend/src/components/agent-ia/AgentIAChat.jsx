import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import axios from "axios";

export default function AgentIAChat() {
  const [chatOuvert, setChatOuvert] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ia",
      texte: "Bonjour ! Décris-moi tes centres d'intérêt ou tes compétences, et je peux t'aider à choisir un sujet.",
    },
  ]);
  const [saisie, setSaisie] = useState("");
  const [chargement, setChargement] = useState(false);

  const envoyerMessage = async () => {
    if (!saisie.trim()) return;

    const messageUtilisateur = { role: "utilisateur", texte: saisie };
    setMessages((prev) => [...prev, messageUtilisateur]);
    setSaisie("");
    setChargement(true);

    try {
      // TODO: adapter l'URL une fois le backend Laravel + Ollama branché
      // Le backend Laravel appellera Ollama en local (ex: http://localhost:11434/api/generate)
      // et cette route renverra juste la réponse texte au frontend
      const res = await axios.post("/api/agent-ia/chat", {
        message: messageUtilisateur.texte,
      });

      setMessages((prev) => [...prev, { role: "ia", texte: res.data.reponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ia", texte: "Désolé, une erreur est survenue. Réessaie plus tard." },
      ]);
    } finally {
      setChargement(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") envoyerMessage();
  };

  return (
    <>
      {!chatOuvert && (
        <button
          onClick={() => setChatOuvert(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition hover:scale-105"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {chatOuvert && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden z-50">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-medium text-sm">Agent IA</span>
            </div>
            <button onClick={() => setChatOuvert(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "utilisateur" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] text-sm px-3 py-2 rounded-2xl ${
                    m.role === "utilisateur"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-yellow-50 text-neutral-800 rounded-bl-sm"
                  }`}
                >
                  {m.texte}
                </div>
              </div>
            ))}
            {chargement && (
              <div className="flex justify-start">
                <div className="bg-yellow-50 text-neutral-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  En train d'écrire...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 p-2 flex items-center gap-2">
            <input
              type="text"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris ton message..."
              disabled={chargement}
              className="flex-1 text-sm px-3 py-2 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50"
            />
            <button
              onClick={envoyerMessage}
              disabled={chargement}
              className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition shrink-0 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}