import { ga } from './ga';
import { fl } from './fl';
import { nj } from './nj';
import { ca } from './ca';
import { la } from './la';
import { in as indiana } from './in';

export const states = {
  GA: ga,
  FL: fl,
  NJ: nj,
  CA: ca,
  LA: la,
  IN: indiana,
};

export type StateCode = keyof typeof states;