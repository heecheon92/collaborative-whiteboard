import { supabase } from "../lib/supabase";

const DRAWING_ROOM_TABLE = "drawing-rooms"; // supabase table name

/**
 * Create Drawing Room Service
 * This function will handle the creation of a new drawing room.
 * It'll accept the new room's name, userId, and the isPublic status.
 * It is also not going to be password-protected by default.
 */
export const createDrawingRoom = async (
  name: string,
  userId: string,
  isPublic: boolean
) => {
  const { data } = await supabase
    .from(DRAWING_ROOM_TABLE)
    .insert({
      name,
      owner: userId,
      isPublic,
      isPasswordProtected: false,
      password: null,
    })
    .select();

  return data;
};

/**
 * Fetch All Drawing Rooms Service
 * This function will be used for fetching all the drawing rooms.
 */
export const fetchAllDrawingRooms = async () => {
  const { data } = await supabase
    .from(DRAWING_ROOM_TABLE)
    .select()
    .order("created_at", { ascending: false });

  return data;
};

/**
 * Fetch User Drawing Rooms Service
 * This function will be used for fetching all the drawing rooms belonging to a user.
 * It'll only accept a userId and returns all the drawing rooms whose owner matches the userId.
 */
export const fetchUserDrawingRooms = async (userId: string) => {
  const { data } = await supabase
    .from(DRAWING_ROOM_TABLE)
    .select()
    .eq("owner", userId)
    .order("created_at", { ascending: false });

  return data;
};

/**
 * Fetch Drawing Room By ID Service
 * This function will return a specific drawing room that matches the provided room id.
 * We'll use this for viewing a specific drawing room later.
 */
export const fetchDrawingRoomById = async (id: string) => {
  const { data } = await supabase
    .from(DRAWING_ROOM_TABLE)
    .select()
    .eq("id", id);
  return data;
};

/**
 * Update Drawing Room Service
 * This function will be used to update the drawings drawn in the room.
 * We'll be passing the roomId and the latest drawing object to it.
 */
export const updateRoomDrawing = async (roomId: string, drawing: any) => {
  await supabase
    .from(DRAWING_ROOM_TABLE)
    .update({
      drawing,
    })
    .eq("id", roomId)
    .select();
};
