import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import express, { application } from 'express';
import helmet from 'helmet';
import art from 'express-art-template';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

app.engine('art', art);
app.set('view engine', 'art');

app.use(async (req, res, next) => {
  try {
    const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
    res.locals.version = JSON.parse(packageJson).version;
    next();
  } catch (e) {
    // Bad file read
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {
  res.render('index', {
    version: res.locals.version
  });
});

app.listen(process.env.PORT || 7272);
