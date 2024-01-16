import { adminAuthClient, supabase } from "../lib/supabase";

/**
 * Get User Session Service
 * This function will be used to retrieve the session data of the currently logged-in user from Supabase.
 */
export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Fetch User By ID
 * This function will be used to get a user profile by their ID.
 */
export const fetchUserById = async (userId: string) => {
  const { data, error } = await adminAuthClient.getUserById(userId);
  return data;
};
