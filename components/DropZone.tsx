import React, { useState } from 'react';
import type { GameItem } from '../types';
import { DraggableCard } from './DraggableCard';

interface DropZoneProps {
  id: string;
  item: GameItem | null;
  onDrop: (targetId: string, itemId: string) => void;
  onReturn: (item: GameItem) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ id, item, onDrop, onReturn }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    onDrop(id, itemId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-28 h-28 flex-shrink-0 rounded-lg border-2 border-dashed transition-colors duration-200 ${isOver ? 'border-blue-500 bg-blue-100' : 'border-slate-300 bg-slate-100'}`}
    >
      {item ? (
        <DraggableCard item={item} isDraggable={false} onClick={() => onReturn(item)} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-400 text-lg">Solte aqui</span>
        </div>
      )}
    </div>
  );
};