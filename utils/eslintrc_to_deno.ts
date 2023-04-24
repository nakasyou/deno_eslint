export default async (eslintrc) => {
  if(eslintrc.parser){
    const parser = await import(eslintrc.parser);
    console.log(parser);
  }
  return eslintrc;
};