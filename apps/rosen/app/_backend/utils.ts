import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * get rosen tokens object from tokensMap file or throw error if file is missing
 */
export const getRosenTokens = () => {
  try {
    console.log('########### cwd:', process.cwd());
    console.log('dirname ', __dirname);
    console.log('import meta url ', fileURLToPath(import.meta.url));
    console.log('$$$$$$$$$$$ LS1: ', fs.readdirSync(process.env.LS1!));
    console.log('$$$$$$$$$$$ LS2: ', fs.readdirSync(process.env.LS2!));
    console.log('$$$$$$$$$$$ LS3: ', fs.readdirSync(process.env.LS3!));
  } catch (error) {
    console.warn('Ye etefaghe badi oftad', error);
  }
  const tokensMapFilePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../configs/tokensMap.json',
  );

  if (fs.existsSync(tokensMapFilePath)) {
    const tokensMap = JSON.parse(
      fs.readFileSync(tokensMapFilePath, {
        encoding: 'utf-8',
      }),
    );
    return tokensMap;
  }

  throw new Error(`Tokens map file not found in the path ${tokensMapFilePath}`);
};
