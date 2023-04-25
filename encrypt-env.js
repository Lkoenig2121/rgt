const path = require(`path`);
const { readFile, writeFile, access, F_OK } = require(`fs/promises`);
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const exists = async (filePath) => {
  try {
    await access(filePath, F_OK);
    return true;
  } catch {
    return false;
  }
};

const envPath = path.join(__dirname, `.env`);
const encryptedEnvPath = path.join(__dirname, `.env.enc`);

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;

const getKey = (secret, salt) =>
  crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');

const encrypt = (secret, value) => {
  if (value == null) {
    throw new Error('value must not be null or undefined');
  }

  const iv = crypto.randomBytes(ivLength);
  const salt = crypto.randomBytes(saltLength);

  const key = getKey(secret, salt);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(value), 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
};

const decrypt = (secret, value) => {
  if (value == null) {
    throw new Error('value must not be null or undefined');
  }

  const stringValue = Buffer.from(String(value), 'hex');

  const salt = stringValue.slice(0, saltLength);
  const iv = stringValue.slice(saltLength, tagPosition);
  const tag = stringValue.slice(tagPosition, encryptedPosition);
  const encrypted = stringValue.slice(encryptedPosition);

  const key = getKey(secret, salt);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};

const encryptQuestions = async ({ password: optionalPassword }) => {
  const envExists = await exists(envPath);

  if (!envExists) {
    console.log(`env ${envPath} does not exist, aborting`);
    return;
  }

  console.log(`reading .env: ${envPath}`);
  const env = await readFile(envPath);

  const password = optionalPassword
    ? optionalPassword
    : await question(`\ngive me a password: `);

  const encryptedEnvPathExists = await exists(encryptedEnvPath);

  const yesOrNo = !encryptedEnvPathExists
    ? `y`
    : await question(
        `are you sure you want to overrite your current ${encryptedEnvPath}? [y/n] `
      );

  if (!/^y/i.test(yesOrNo)) {
    console.log(`aborting encryption`);
    return;
  }

  optionalPassword && console.log(`using provided --password`);
  console.log(`encrypting current .env`);
  const encryptedEnv = encrypt(password, env);

  console.log(`writing encrypted .env to: ${encryptedEnvPath}`);
  await writeFile(encryptedEnvPath, encryptedEnv);
};

const decryptQuestions = async ({ password: optionalPassword }) => {
  const envExists = await exists(envPath);

  if (envExists) {
    console.log(`env ${envPath} exists, aborting`);
    return;
  }

  console.log(`checking encrypted env exists...`);
  const encryptedEnvExists = await exists(encryptedEnvPath);

  if (!encryptedEnvExists) {
    console.log(`env ${encryptedEnvPath} does not exist, aborting`);
    return;
  }

  console.log(`reading ${encryptedEnvPath}`);
  const encryptedEnv = await readFile(encryptedEnvPath);

  const password = optionalPassword
    ? optionalPassword
    : await question(
        `\ngive me the secret (please reach out to domenic.colandrea@gmail.com for secret): `
      );

  console.log(`decrypting ${encryptedEnvPath}`);
  const env = decrypt(password, encryptedEnv);

  console.log(`writing decrypted env to: ${envPath}`);
  await writeFile(envPath, env);
};

const createOptionsMap = (options) => {
  return options.reduce((acc, next, i) => {
    if (/^--encrypt$/.test(next)) return { ...acc, encrypt: true };
    if (/^--decrypt$/.test(next)) return { ...acc, decrypt: true };
    if (/^--password$/.test(next)) return { ...acc, password: options[i + 1] };

    return acc;
  }, {});
};

const checkOptions = (options) => {
  if (options.encrypt && options.decrypt)
    return `You cannot both encrypt and decrypt the .env file, please choose either --encrypt or --decrypt`;

  if (
    options.hasOwnProperty(`password`) &&
    (!options.password ||
      options.password === `--encrypt` ||
      options.password === `--decrypt`)
  )
    return `You must provide a password if --password is provided`;

  return null;
};

const main = async () => {
  const [, , ...rawOptions] = process.argv;

  const options = createOptionsMap(rawOptions);
  const error = checkOptions(options);

  if (error) {
    console.error(`\n[ERROR]: ${error}\n`);
    rl.close();
    return process.exit(1);
  }

  const answer =
    !options.encrypt &&
    !options.decrypt &&
    (await question(`[e]ncrypt or [d]crypt .env: `));

  if (/^\s*e\s*$/i.test(answer) || options.encrypt) {
    await encryptQuestions(options);
  }

  if (/^\s*d\s*$/i.test(answer) || options.decrypt) {
    await decryptQuestions(options);
  }

  rl.close();
};

main();
