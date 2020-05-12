import { getInput } from '@actions/core';
import { render } from 'mustache';
import { promises as fs } from 'fs';

async function parseTemplate(){
  const consulUrl = getInput('url', { required: true });
  const consulport = getInput('port', { required: true });
  const consulSecure = getInput('secure', { required: false });
  const consulDatacenter = getInput('datacenter', { required: false });
  const consulToken = getInput('token', { required: false });
  const consulKey = getInput('key', { required: false });
  const consulCA = getInput('ca', { require: false });

  const valuesExtras = getInput('extras', { requried: false });

  const templateFile = getInput('template', { required: true });
  try {
    await fs.stat(templateFile)
  } catch(e) {
    console.log(e)
    throw e;
  }

  let templateOut;
  const outFile = getInput('out', { required: false });
  if (outFile.length == 0){
    templateOut = `${templateFile}.parsed`;
  } else {
    templateOut = outFile;
  }

  console.log("connecting to consul");

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
    console.log(e);
    throw e;
  }

  try {
    console.log(`gitting key values from consul for ${consulKey}`);

    const keys = await consul.kv.get({key: consulKey, recurse: true});
    for (const key of keys) {
      if (key.Key.slice(-1) == "/") {
        continue;
      }
      const keySplit = key.Key.split('/');
      values[keySplit[keySplit.length-1]] = key.Value;
    }
  } catch(e) {
    console.log(e);
    throw e;
  }

  let parsed;

  try {
    console.log(`Parsing file ${templateFile}`);
    const data = await fs.readFile(templateFile, 'utf-8');
    const p = render(data, values);
    parsed = p;
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {
    console.log(`Writing output file ${templateOut}`);
    await fs.writeFile(templateOut, parsed);
  } catch (e) {
    console.log(e);
    throw e
  }
};

export default {parseTemplate};