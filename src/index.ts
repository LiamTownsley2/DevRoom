import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

import * as exfs from 'fs-extra';

// Suppress Experimental stream/web warning.
process.removeAllListeners('warning');

exfs.emptyDirSync(resolve(__dirname, './images'));

import './client'
