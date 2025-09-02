import React, { useState, useEffect, useCallback } from 'react';
import type { GameItem, Problem } from '../types';
import { DraggableCard } from './DraggableCard';
import { DropZone } from './DropZone';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const areFractionsEquivalent = (f1: {numerator: number, denominator: number}, f2: {numerator: number, denominator: number}): boolean => {
    return f1.numerator * f2.denominator === f1.denominator * f2.numerator;
}

const generateProblems = (level: number): Problem[] => {
    const problems: Problem[] = [];
    const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#EC4899'];
    const shapes: ('circle' | 'bar')[] = ['circle', 'bar'];

    let baseFractions: {numerator: number, denominator: number}[];

    if (level <= 2) { // Fácil
        baseFractions = [
            { numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, { numerator: 2, denominator: 3 }, { numerator: 1, denominator: 4 }, { numerator: 3, denominator: 4 }
        ];
    } else if (level <= 4) { // Médio
        baseFractions = [
            { numerator: 1, denominator: 5 }, { numerator: 2, denominator: 5 }, { numerator: 3, denominator: 5 }, { numerator: 4, denominator: 5 }, { numerator: 1, denominator: 6 }, { numerator: 5, denominator: 6 }
        ];
    } else { // Difícil
        baseFractions = [
            { numerator: 1, denominator: 8 }, { numerator: 3, denominator: 8 }, { numerator: 5, denominator: 8 }, { numerator: 2, denominator: 7 }, { numerator: 3, denominator: 7 }, { numerator: 4, denominator: 9 }
        ];
    }
    
    baseFractions = shuffleArray(baseFractions);

    const count = Math.min(2 + Math.floor(level / 2), 6);

    for (let i = 0; i < count; i++) {
        const base = baseFractions[i % baseFractions.length];
        const multiplier = 2 + Math.floor(Math.random() * (level + 1));
        const equivalent = { numerator: base.numerator * multiplier, denominator: base.denominator * multiplier };
        
        const id = `problem-${i}`;
        problems.push({
            id: id,
            numeric: { 
                id: `${id}-numeric`, 
                type: 'numeric', 
                fraction: base,
            },
            visual: {
                id: `${id}-visual`,
                type: 'visual',
                fraction: equivalent,
                visual: {
                    ...equivalent,
                    shape: shapes[i % shapes.length],
                    color: colors[i % colors.length]
                }
            }
        });
    }
    return problems;
};


export const MatchingGame: React.FC = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [sourceItems, setSourceItems] = useState<GameItem[]>([]);
    const [targetSlots, setTargetSlots] = useState<Record<string, GameItem | null>>({});
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const setupLevel = useCallback(() => {
        const newProblems = generateProblems(level);
        setProblems(newProblems);
        
        const numericItems = newProblems.map(p => p.numeric);
        const visualItems = newProblems.map(p => p.visual);

        setSourceItems(shuffleArray(visualItems));

        const newTargetSlots: Record<string, GameItem | null> = {};
        numericItems.forEach(item => {
            newTargetSlots[item.id] = null;
        });
        setTargetSlots(newTargetSlots);
        setFeedback(null);
    }, [level]);

    useEffect(() => {
        setupLevel();
    }, [level, setupLevel]);

    const handleDrop = (targetId: string, itemId: string) => {
        const itemToMove = sourceItems.find(item => item.id === itemId);
        if (!itemToMove) return;

        setTargetSlots(prev => {
            const newSlots = { ...prev };
            // Return any item currently in the target slot back to sources
            const existingItem = newSlots[targetId];
            if (existingItem) {
                setSourceItems(currentSources => [...currentSources, existingItem]);
            }
            // Place new item in the slot
            newSlots[targetId] = itemToMove;
            return newSlots;
        });

        // Remove the item from the source list
        setSourceItems(prev => prev.filter(item => item.id !== itemId));
    };
    
    const handleReturnToSource = (item: GameItem) => {
        setTargetSlots(prev => {
            const newSlots = {...prev};
            for(const key in newSlots) {
                if(newSlots[key]?.id === item.id) {
                    newSlots[key] = null;
                }
            }
            return newSlots;
        });
        setSourceItems(prev => [...prev, item]);
    }

    const checkAnswers = () => {
        let correctMatches = 0;
        problems.forEach(problem => {
            const droppedItem = targetSlots[problem.numeric.id];
            if(droppedItem && areFractionsEquivalent(problem.numeric.fraction, droppedItem.fraction)){
                correctMatches++;
            }
        });

        if (correctMatches === problems.length) {
            setFeedback({ message: `Correto! Muito bem! Avançando para o próximo nível.`, type: 'success' });
            setScore(prev => prev + (level * 10));
            setTimeout(() => {
                setLevel(prev => prev + 1);
            }, 2000);
        } else {
            setFeedback({ message: `Quase lá! Você acertou ${correctMatches} de ${problems.length}. Tente novamente.`, type: 'error' });
             setTimeout(() => setFeedback(null), 3000);
        }
    };
    
    const handleSetLevel = (newLevel: number) => {
        setLevel(newLevel);
        setScore(0);
    }

    const allSlotsFilled = Object.values(targetSlots).every(slot => slot !== null);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-700">Nível: {level}</h2>
                    <div className="text-2xl font-bold text-blue-600">Pontuação: {score}</div>
                </div>
                 <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <span className="font-semibold text-slate-600 px-2">Dificuldade:</span>
                    <button 
                        onClick={() => handleSetLevel(1)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${level <= 2 ? 'bg-green-500 text-white shadow' : 'bg-transparent text-green-800 hover:bg-green-100'}`}>
                        Fácil
                    </button>
                    <button 
                        onClick={() => handleSetLevel(3)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${level > 2 && level <= 4 ? 'bg-yellow-500 text-white shadow' : 'bg-transparent text-yellow-800 hover:bg-yellow-100'}`}>
                        Médio
                    </button>
                     <button 
                        onClick={() => handleSetLevel(5)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${level > 4 ? 'bg-red-500 text-white shadow' : 'bg-transparent text-red-800 hover:bg-red-100'}`}>
                        Difícil
                    </button>
                </div>
                <button 
                    onClick={setupLevel}
                    className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75">
                    Reiniciar Nível
                </button>
            </div>

            {/* Target Area */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200`}>
                {problems.map(problem => (
                    <div key={problem.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                         <div className="w-28 h-28 flex-shrink-0">
                            <DraggableCard item={problem.numeric} isDraggable={false} />
                         </div>
                         <div className="text-3xl font-bold text-slate-400">=</div>
                         <DropZone id={problem.numeric.id} onDrop={handleDrop} item={targetSlots[problem.numeric.id]} onReturn={handleReturnToSource} />
                    </div>
                ))}
            </div>

            {/* Source Area */}
            <div className="p-4 bg-blue-50 rounded-lg min-h-[150px]">
                 <h3 className="text-xl font-semibold text-slate-600 mb-4 text-center">Frações Disponíveis</h3>
                 {sourceItems.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {sourceItems.map(item => (
                            <div key={item.id} className="w-32 h-32">
                                <DraggableCard item={item} isDraggable={true} />
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center text-slate-500 py-10">Todos os itens foram colocados!</div>
                 )}
            </div>

            {/* Actions */}
            <div className="mt-8 text-center">
                 {feedback && (
                    <div className={`p-3 rounded-lg mb-4 text-white font-semibold ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {feedback.message}
                    </div>
                )}
                <button
                    onClick={checkAnswers}
                    disabled={!allSlotsFilled}
                    className="px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none">
                    Verificar Respostas
                </button>
            </div>
        </div>
    );
};