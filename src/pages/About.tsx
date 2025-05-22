
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="inline-block mb-8 text-white hover:text-blue-300 transition-colors"
        >
          ← Zpět na chat
        </Link>
        
        <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-lg mb-8">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">O aplikaci TopBot.PwnZ</h1>
            
            <div className="space-y-4 text-slate-100">
              <p className="leading-relaxed">
                <span className="font-bold text-purple-400">TopBot.PwnZ</span> je extrémně pokročilý český AI asistent 
                s výraznou osobností. Je provokativní, vtipný a občas drzý, ale vždy poskytuje kvalitní odpovědi.
              </p>
              
              <h2 className="text-xl font-bold text-white mt-6">Hlavní funkce:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Výrazná osobnost - hravý, provokativní, dělá vtipy a používá emotikony</li>
                <li>Multimodální komunikace - podpora textu, obrázků a hlasu</li>
                <li>PWA podpora - instalace jako nativní aplikace</li>
                <li>Integrace API - propojení s Google Maps, Weather, Places a dalšími službami</li>
                <li>Speciální příkazy - rozsáhlá sada příkazů pro různé funkce</li>
                <li>Pokročilá analýza - analýza obrázků, textu, generování vizualizací</li>
                <li>Vědomosti v různých oborech - programování, esoterická témata, kvantová fyzika a další</li>
                <li>Responsivní design - podpora mobilních zařízení</li>
                <li>Offline režim - základní funkce i bez připojení</li>
              </ul>
              
              <h2 className="text-xl font-bold text-white mt-6">Speciální příkazy:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-mono bg-slate-700 px-1 rounded">/weather [místo]</span> - Předpověď počasí</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/place [místo]</span> - Informace o místě</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/map [místo]</span> - Mapa zadaného místa</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/search [dotaz]</span> - Vyhledávání na webu</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/image_analyze</span> - Analýza obrázku</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/joke</span> - Vygeneruje vtip</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/about</span> - Informace o tvůrci</li>
                <li><span className="font-mono bg-slate-700 px-1 rounded">/help</span> - Seznam všech příkazů</li>
              </ul>
              
              <h2 className="text-xl font-bold text-white mt-6">Technologie:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Frontend: React, Tailwind CSS, shadcn/ui</li>
                <li>AI: Google Gemini AI 2.0+, Perplexity (pro pokročilé analýzy)</li>
                <li>API integrace: Google Cloud Platform, Google Maps, Weather API</li>
                <li>PWA: Next-PWA pro offline podporu</li>
                <li>Vyhledávání: Serper API (záložní řešení)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-lg mb-8">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Tvůrce</h1>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 rounded-full border-2 border-purple-500">
                <AvatarImage src="/lovable-uploads/ee4448ca-292b-4c59-8d7b-c853504b2f4c.png" alt="František Kalášek" />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold text-white">FK</AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-white">František Kalášek</h2>
                <p className="text-slate-300 mb-4">Vývojář, programátor a AI nadšenec</p>
                
                <p className="text-slate-100 mb-6 max-w-lg">
                  "Mým cílem bylo vytvořit chatbota s osobností, který nezní jako další nudný AI asistent. 
                  TopBot.PwnZ je přesně takový - provokativní, zábavný a přitom extrémně schopný.
                  S využitím nejnovějších technologií od Googlu a dalších služeb přináší pokročilé funkce v českém jazyce."
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <a href="mailto:FandaKalasek@icloud.com" className="flex items-center gap-2 bg-slate-700/70 hover:bg-slate-600 px-3 py-2 rounded-md text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                  <a href="https://facebook.com/frantisek.kalasek/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-700/70 hover:bg-blue-600 px-3 py-2 rounded-md text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                  <a href="https://instagram.com/topbot_pwnz.qq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 rounded-md text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a href="https://wa.me/420722426195" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-700/70 hover:bg-green-600 px-3 py-2 rounded-md text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">VerseVis</h2>
                <p className="text-slate-300 mb-4">
                  Další projekt od Františka Kaláška
                </p>
                <p className="text-slate-100 mb-6 max-w-lg">
                  VerseVis je kreativní aplikace, která tvoří obrazy z básní a textů.
                  Promění vaše slova v umělecká díla pomocí pokročilých AI technologií.
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.open("https://studio--versevis.us-central1.hosted.app/", "_blank")}
                >
                  Vyzkoušet VerseVis
                </Button>
              </div>
              
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
                <img
                  src="/lovable-uploads/8b034600-b266-48d5-8cd1-0acf7f134350.png"
                  alt="VerseVis Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
