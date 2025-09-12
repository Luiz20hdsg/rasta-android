const fs = require('fs');
const path = require('path');

function decodeBase64AndWriteFile(envVar, filePath) {
  const base64Content = process.env[envVar];
  if (!base64Content) {
    console.warn(`⚠️  Variável ${envVar} não encontrada`);
    return;
  }

  const buffer = Buffer.from(base64Content, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ ${filePath} criado com sucesso!`);
}

decodeBase64AndWriteFile('GOOGLE_SERVICES_JSON', path.join(__dirname, 'android', 'app', 'google-services.json'));

