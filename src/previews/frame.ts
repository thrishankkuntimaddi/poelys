import type { PreviewKind } from '../data/products';

type FrameKind = 'browser' | 'phone' | 'tablet' | 'object';
export const frameFor = (k: PreviewKind): FrameKind =>
  k === 'phone-text' || k === 'breath' ? 'phone' : k === 'tablet' ? 'tablet' : k === 'clock' || k === 'rover' ? 'object' : 'browser';
