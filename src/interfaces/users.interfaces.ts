/** @format */

export interface UserProps {
  id?: number;
  username?: string;
  status?: string;
}

export interface UserProfileProps {
  profile_image_url?: string | null;
  banner_image_url?: string | null;
}

export interface UserWithProfileProps extends UserProps, UserProfileProps {}
