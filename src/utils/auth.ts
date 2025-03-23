import bycrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bycrypt.genSalt(10); // 10 es el número de rondas de encriptación, salt es una cadena aleatoria que se utiliza para encriptar la contraseña
  const hash = await bycrypt.hash(password, salt); // hash es la contraseña encriptada
  return hash;
};

export const checkPassword = async (password: string, hash: string) => {
  const result = await bycrypt.compare(password, hash);
  return result;
};
