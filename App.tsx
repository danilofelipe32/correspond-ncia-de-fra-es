import React from 'react';
import { MatchingGame } from './components/MatchingGame';

const App: React.FC = () => {
  return (
    <main className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Desafio de Correspondência de Frações</h1>
          <p className="text-slate-600 mt-2 text-lg">Arraste as frações visuais para combinar com sua forma numérica.</p>
        </header>
        <MatchingGame />
      </div>
    </main>
  );
};

export default App;