import dayjs from "dayjs";

export default {
  debug: (message: string) => console.debug(format(message)),
  log: (message: string) => console.log(format(message)),
  info: (message: string) => console.info(format(message)),
  warn: (message: string) => console.warn(format(message)),
  error: (message: string) => console.error(format(message)),
};

const format = (message: string) => {
  const dateString = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return `${dateString}\t${message}`;
};
