
import React from 'react';
import type { GameItem } from '../types';
import { FractionVisual } from './FractionVisual';

interface DraggableCardProps {
  item: GameItem;
  isDraggable: boolean;
  onClick?: () => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ item, isDraggable, onClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', item.id);
  };
  
  const cardContent = item.type === 'numeric' ? (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-4xl font-bold text-slate-800">{item.fraction.numerator}</span>
      <hr className="w-16 border-t-4 border-slate-800 my-1" />
      <span className="text-4xl font-bold text-slate-800">{item.fraction.denominator}</span>
    </div>
  ) : (
    item.visual && <FractionVisual visual={item.visual} />
  );

  const cursorClass = isDraggable ? 'cursor-grab' : onClick ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      id={item.id}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onClick={onClick}
      className={`w-full h-full p-2 bg-white rounded-lg shadow-md border-2 border-slate-200 flex items-center justify-center transition-all duration-200 ${cursorClass} ${isDraggable ? 'active:cursor-grabbing hover:shadow-xl hover:scale-105' : ''}`}
    >
      {cardContent}
    </div>
  );
};
   