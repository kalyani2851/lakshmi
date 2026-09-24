import type { PageData } from './pages1to6';
import { pages1to6 } from './pages1to6';
import { pages7to12 } from './pages7to12';
import { pages13to18 } from './pages13to18';
import { pages19to24 } from './pages19to24';

export const allPages: PageData[] = [
  ...pages1to6,
  ...pages7to12,
  ...pages13to18,
  ...pages19to24,
];

export type { PageData };

