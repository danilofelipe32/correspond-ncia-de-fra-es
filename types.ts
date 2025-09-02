
export interface Fraction {
  numerator: number;
  denominator: number;
}

export type Shape = 'circle' | 'bar';

export interface VisualFraction extends Fraction {
  shape: Shape;
  color: string;
}

export type ItemType = 'numeric' | 'visual';

export interface GameItem {
  id: string;
  type: ItemType;
  fraction: Fraction;
  visual?: VisualFraction;
}

export interface Problem {
  id: string;
  numeric: GameItem;
  visual: GameItem;
}
   