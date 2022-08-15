const ctx = require.context("./icons", false, /.png|.jpg|.jpeg/);

const icons: { [key: string]: string } = {};

ctx.keys().forEach((key: string) => {
  const uri: string = ctx(key);
  const name = uri.substring(uri.lastIndexOf("/") + 1);
  icons[name] = uri;
});

export const getIcon = (name: string) => {
  if (!icons[name]) {
    throw Error(`Unknown icon '${name}'`);
  }
  return icons[name];
};
