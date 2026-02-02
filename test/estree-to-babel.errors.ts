import {estreeToBabel} from '../lib/estree-to-babel.js';

estreeToBabel();
// THROWS Argument of type 'number' is not assignable to parameter of type 'Node'.
estreeToBabel(1);
