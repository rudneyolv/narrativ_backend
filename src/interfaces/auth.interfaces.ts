/** @format */

export interface PrivateUser {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
}

export interface createUserProps {
  username: string;
  email: string;
  password: string;
}

export interface insertUserProps {
  username: string;
  email: string;
  hashed_password: string;
}

export interface LoginUserProps {
  email: string;
  password: string;
}
