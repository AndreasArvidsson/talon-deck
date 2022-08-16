const ctx = require.context("./icons", true, /\.(png|jpg|jpeg|gif|svg|webp)$/);

const icons: { [key: string]: string } = {};

ctx.keys().forEach((key: string) => {
  if (key.startsWith("./")) {
    const name = key.substring(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    if (icons[name]) {
      throw Error(`Duplicate icon with name '${name}'`);
    }
    icons[name] = ctx(key);
  }
});

export const getIcon = (name: string) => {
  if (!icons[name]) {
    console.warn(`Unknown icon '${name}'`);
    return null;
  }
  return icons[name];
};
