import {
  ESLint,
  stdFlags,
  actionsCore,
} from "./deps.ts";
import getEslintrc from "./utils/get_eslintrc.ts";
import eslintrcToDeno from "./utils/eslintrc_to_deno.ts";

const args: string[] = [...Deno.args];
const parseGlob = args.pop();
const flags = stdFlags.parse(args, {
  boolean: [],
  string: [],
});
const eslint = new ESLint({
  useEslintrc: false,
  overrideConfig: await eslintrcToDeno(await getEslintrc()),
});

const results = await eslint.lintFiles([parseGlob]);

const isGitHubActions = Deno.env.get("GITHUB_ACTIONS") === "true";

let errors = [0,0,0];

console.log("");
for(const file of results){
  let is_err = false;
  for(const message of file.messages){
    errors[message.severity]++;
    
    if(!is_err){
      is_err = true;
      console.log("\u001b[4m"+file.filePath+"\u001b[39m");
    }
    const msg = `  ${message.line}:${message.column}  ${["","warning","error"][message.severity]}  ${message.message}  ${message.ruleId}`;
    
    if(isGitHubActions){
      actionsCore[["","warning","error"][message.severity]](msg, {
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
  console.log(`\u001b[31m✖ ${errors[1]+errors[2]} problems (${errors[1]} errors, ${errors[2]} warnings)\u001b[39m
`)
  Deno.exit(1);
}
