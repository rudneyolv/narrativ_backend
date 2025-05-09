/** @format */

export interface UserProps {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
}

export interface UserProfileProps {
  profile_image_url?: string | null;
  banner_image_url?: string | null;
}

export interface UserWithProfileProps extends UserProps, UserProfileProps {}
