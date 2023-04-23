import { ESLint } from "npm:eslint";
import * as core from "npm:@actions/core";

const eslint = new ESLint();

const results = await eslint.lintFiles(["**/*.js"]);

for(const file of results){
  for(const message from file.messages){
    core.error(message.message, {file: file.filePath, startLine: message.line})
  }
}

const formatter = await eslint.loadFormatter("stylish");

const resultText = formatter.format(results);

if(resultText){
  console.log(resultText);
  Deno.exit(1)
}
