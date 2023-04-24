import { path } from "../deps.ts";

const isFile = async (filename: string): Promise<boolean> => {
  try {
    return (await Deno.stat(filename)).isFile;
  }catch (err){
    if(err instanceof Deno.errors.NotFound)
      return false;
    else
      throw err;
  }
};

export default async () => {
  const eslintrcJS = path.join(Deno.cwd(),"./.eslintrc.js");
  if(await isFile(eslintrcJS)){
    const module = await import(eslintrcJS);
    return module.default;
  }
  throw new Error("eslintrc file is not found");
}