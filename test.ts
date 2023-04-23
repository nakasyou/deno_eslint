import { ESLint } from "npm:eslint";
import * as core from "npm:@actions/core";

const eslint = new ESLint();

const results = await eslint.lintFiles(["**/*.js"]);

const isGitHubActions = Deno.env.get("GITHUB_ACTIONS") === "true";

for(const file of results){
  let is_err = false;
  for(const message of file.messages){
    if(!is_err){
      is_err = true;
      console.log(file.filePath);
    }
    const msg = `${message.line}:${message.column} ${message.message}`;
    if(isGitHubActions){
      core[["","","warning","error"][message.severity]]("    "+msg, {
        file: file.filePath,
        line: message.line,
        column: message.column,
      });
    }
  }
}
