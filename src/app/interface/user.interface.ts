export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface UpdatePassword {
  password: string;
}
