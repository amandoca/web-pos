import type { User } from "../../domain/auth/auth.types";

export interface AuthUserRecord extends User {
  password: string;
}

export const usersMock: AuthUserRecord[] = [
  {
    id: 1,
    name: "Administrador",
    username: "admin",
    password: "admin",
    role: "ADMINISTRADOR",
    isActive: true,
  },
  {
    id: 2,
    name: "Operador",
    username: "operador",
    password: "operador",
    role: "OPERADOR",
    isActive: true,
  },
];
