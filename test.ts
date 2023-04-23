import { ESLint } from "npm:eslint";
import * as core from "npm:@actions/core";

const eslint = new ESLint();

const results = await eslint.lintFiles(["**/*.js"]);

const isGitHubActions = Deno.env.get("GITHUB_ACTIONS");
console.log(isGitHubActions)
console.log(typeof isGitHubActions)

for(const file of results){
  for(const message of file.messages){
    core.error(message.message, {
      file: file.filePath,
      line: message.line,
      column: message.column,
    });
  }
}

const formatter = await eslint.loadFormatter("stylish");

const resultText = formatter.format(results);

if(resultText){
  console.log(resultText);
  Deno.exit(1)
}
