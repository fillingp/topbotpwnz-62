
import React from 'react';

const TipsSection: React.FC = () => {
  return (
    <div className="text-sm text-slate-400">
      <p>Tipy pro lepší výsledky:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>Používejte bohatý, popisný jazyk</li>
        <li>Pro básně nebo lyrické texty používejte metafory a přirovnání</li>
        <li>Uvádějte konkrétní barvy, materiály nebo tvary, které si představujete</li>
        <li>Při analýze obrázků zadávejte konkrétní otázky nebo témata</li>
      </ul>
    </div>
  );
};

export default TipsSection;
