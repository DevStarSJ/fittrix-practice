import { UserRole } from "src/entities/user.entity";

export class SignUpInput {
  email: string;
  password: string;
  passwordConfirm: string;
  role: UserRole;
}