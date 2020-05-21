const Mustache = require('mustache');
const fs = require('fs').promises;
const core = require('@actions/core');

async function parseTemplate () {
  const consulUrl = core.getInput('url', { required: true });
  const consulport = core.getInput('port', { required: true });
  const consulSecure = core.getInput('secure', { required: false });
  const consulDatacenter = core.getInput('datacenter', { required: false });
  const consulToken = core.getInput('token', { required: false });
  const consulKey = core.getInput('key', { required: false });
  const consulCA = core.getInput('ca', { require: false });

  const valuesExtras = core.getInput('extras', { requried: false });

  const templateFile = core.getInput('template', { required: true });
  try {
    await fs.stat(templateFile)
  } catch (e) {
    console.log(e)
    throw e;
  }

  let templateOut;
  const outFile = core.getInput('out', { required: false });
  if (outFile.length === 0) {
    templateOut = `${templateFile}.parsed`;
  } else {
    templateOut = outFile;
  }

  console.log('connecting to consul');

  const consul = require('consul')({
    host: consulUrl,
    port: consulport,
    secure: consulSecure,
    ca: [consulCA],
    defaults: {
      dc: consulDatacenter | 'dc1',
      token: consulToken
    },
    promisify: true
  });

  let values
  try {
    const parsed = valuesExtras ? JSON.parse(valuesExtras) : {};
    values = parsed
  } catch (e) {
    console.log(`trouble parsing extra values (${e.messgae})`);
    throw e;
  }

  try {
    console.log(`getting key values from consul for ${consulKey}`);

    const keys = await consul.kv.get({ key: consulKey, recurse: true });
    for (const key of keys) {
      if (key.Key.slice(-1) === '/') {
        continue;
      }
      const keySplit = key.Key.split('/');
      values[keySplit[keySplit.length - 1]] = key.Value;
    }
  } catch (e) {
    console.log(`trouble getting values from consul (${e.message})`);
    throw e;
  }

  let parsed;

  try {
    console.log(`Parsing file ${templateFile}`);
    const data = await fs.readFile(templateFile, 'utf-8');
    const p = Mustache.render(data, values);
    parsed = p;
  } catch (e) {
    console.log(`trouble rendering template file (${e.message})`);
    throw e;
  }

  try {
    console.log(`Writing output file ${templateOut}`);
    await fs.writeFile(templateOut, parsed);
  } catch (e) {
    console.log(`trouble writing template file output (${e.message})`);
    throw e
  }
};

module.exports = { parseTemplate };
