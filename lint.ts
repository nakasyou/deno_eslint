import { ESLint } from "npm:eslint";
import * as core from "npm:@actions/core";

const eslint = new ESLint();

const results = await eslint.lintFiles(["**/*.js"]);

const isGitHubActions = Deno.env.get("GITHUB_ACTIONS") === "true";

let errors = [0,0,0];

console.log("");
for(const file of results){
  let is_err = false;
  for(const message of file.messages){
    errors[message.severity]++;
    
    if(!is_err){
      is_err = true;
      console.log("\e[4m"+file.filePath);
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
  if(is_err){
    console.log("");
  }
}

if(errors[2]!==0){
  console.log(`✖ ${errors[1]+errors[2]} problems (${errors[1]} errors, ${errors[2]} warnings)
`)
  Deno.exit(1);
}
