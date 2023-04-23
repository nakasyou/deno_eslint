import { ESLint } from "npm:eslint";
import * as core from "npm:@actions/core";

const eslint = new ESLint();

const results = await eslint.lintFiles(["**/*.js"]);

const isGitHubActions = Deno.env.get("GITHUB_ACTIONS") === "true";

let errors = [0,0,0];

for(const file of results){
  let is_err = false;
  for(const message of file.messages){
    errors[message.severity]++;
    
    if(!is_err){
      is_err = true;
      console.log(file.filePath);
    }
    const msg = `  ${message.line}:${message.column}  ${["","warning","error"][message.severity]}  ${message.message}  ${message.ruleId}`;
    
    if(isGitHubActions){
      core[["","warning","error"][message.severity]](msg, {
        file: file.filePath,
        line: message.line,
        column: message.column,
        startLine: message.line,
      });
    }else{
      console[["","warn","error"][message.severity]](msg);
    }
  }
}

if(errors[2]!==0){
  Deno.exit(1);
}
