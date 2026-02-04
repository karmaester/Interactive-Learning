"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Theater, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

const SCENARIOS: Record<Language, Scenario[]> = {
  en: [
    { id: "restaurant", title: "At the Restaurant", description: "Order food, ask about the menu, and pay the bill", icon: "🍽️", prompt: "Let's role-play a restaurant scene. You are the waiter and I am a customer. Greet me and hand me the menu." },
    { id: "airport", title: "At the Airport", description: "Check in, go through security, find your gate", icon: "✈️", prompt: "Let's role-play at the airport. You work at the check-in counter and I just arrived for my flight." },
    { id: "hotel", title: "Hotel Check-in", description: "Book a room, ask about amenities, handle issues", icon: "🏨", prompt: "Let's role-play a hotel scene. You are the receptionist and I'm checking in." },
    { id: "shopping", title: "Shopping Trip", description: "Try clothes, ask for sizes, negotiate prices", icon: "🛍️", prompt: "Let's role-play a shopping scene. You are a shop assistant and I want to buy some clothes." },
    { id: "doctor", title: "Doctor's Visit", description: "Describe symptoms, understand diagnosis, get a prescription", icon: "🏥", prompt: "Let's role-play a doctor's visit. You are the doctor and I have some health concerns." },
    { id: "interview", title: "Job Interview", description: "Answer questions, present yourself, ask about the role", icon: "💼", prompt: "Let's role-play a job interview. You are the interviewer for a position I applied for. Start the interview." },
  ],
  es: [
    { id: "restaurant", title: "En el Restaurante", description: "Pedir comida, preguntar por el menú y pagar la cuenta", icon: "🍽️", prompt: "Hagamos un juego de roles en un restaurante. Tú eres el camarero y yo soy el cliente. Salúdame y dame el menú." },
    { id: "airport", title: "En el Aeropuerto", description: "Facturar, pasar seguridad, encontrar la puerta", icon: "✈️", prompt: "Hagamos un juego de roles en el aeropuerto. Trabajas en el mostrador de facturación y acabo de llegar." },
    { id: "hotel", title: "En el Hotel", description: "Reservar habitación, preguntar por servicios", icon: "🏨", prompt: "Hagamos un juego de roles en un hotel. Tú eres el recepcionista y yo quiero registrarme." },
    { id: "shopping", title: "De Compras", description: "Probar ropa, preguntar tallas, regatear", icon: "🛍️", prompt: "Hagamos un juego de roles de compras. Tú eres el dependiente y yo quiero comprar ropa." },
    { id: "doctor", title: "En el Médico", description: "Describir síntomas, entender el diagnóstico", icon: "🏥", prompt: "Hagamos un juego de roles en el médico. Tú eres el doctor y tengo algunas molestias." },
    { id: "interview", title: "Entrevista de Trabajo", description: "Responder preguntas, presentarse", icon: "💼", prompt: "Hagamos un juego de roles de entrevista laboral. Tú eres el entrevistador." },
  ],
  de: [
    { id: "restaurant", title: "Im Restaurant", description: "Essen bestellen, nach der Karte fragen, bezahlen", icon: "🍽️", prompt: "Lass uns ein Rollenspiel im Restaurant machen. Du bist der Kellner und ich bin der Gast. Begrüße mich." },
    { id: "airport", title: "Am Flughafen", description: "Einchecken, Sicherheitskontrolle, Gate finden", icon: "✈️", prompt: "Lass uns ein Rollenspiel am Flughafen machen. Du arbeitest am Check-in und ich komme gerade an." },
    { id: "hotel", title: "Im Hotel", description: "Zimmer buchen, nach Annehmlichkeiten fragen", icon: "🏨", prompt: "Lass uns ein Rollenspiel im Hotel machen. Du bist der Rezeptionist und ich möchte einchecken." },
    { id: "shopping", title: "Einkaufen", description: "Kleidung anprobieren, nach Größen fragen", icon: "🛍️", prompt: "Lass uns ein Rollenspiel beim Einkaufen machen. Du bist der Verkäufer und ich möchte Kleidung kaufen." },
    { id: "doctor", title: "Beim Arzt", description: "Symptome beschreiben, Diagnose verstehen", icon: "🏥", prompt: "Lass uns ein Rollenspiel beim Arzt machen. Du bist der Arzt und ich habe Beschwerden." },
    { id: "interview", title: "Vorstellungsgespräch", description: "Fragen beantworten, sich vorstellen", icon: "💼", prompt: "Lass uns ein Vorstellungsgespräch als Rollenspiel machen. Du bist der Interviewer." },
  ],
};

interface ScenarioSelectorProps {
  language: Language;
  onSelect: (scenario: Scenario) => void;
  className?: string;
}

export function ScenarioSelector({
  language,
  onSelect,
  className,
}: ScenarioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scenarios = SCENARIOS[language] || SCENARIOS.en;

  return (
    <div className={cn("", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
          isOpen
            ? "bg-purple-50 text-purple-600 border-purple-200"
            : "bg-slate-50 text-slate-500 border-dashed border-slate-300 hover:bg-purple-50 hover:text-purple-600"
        )}
      >
        <Theater className="w-3 h-3" />
        Role-play Scenarios
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    onSelect(scenario);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all text-left cursor-pointer group"
                >
                  <span className="text-xl flex-shrink-0">
                    {scenario.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                      {scenario.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {scenario.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
