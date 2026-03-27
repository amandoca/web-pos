export type UserRole = "ADMINISTRADOR" | "OPERADOR";

export interface User {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  isActive: boolean;
}

// Diz se o usuário logado tem perfil de administrador.
export function isAdminUser(user: User): boolean {
  return user.role === "ADMINISTRADOR";
}
