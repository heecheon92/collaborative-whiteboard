"use client";

import BoardContainer from "@/app/components/drawing-room/BoardContainer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchDrawingRoomById } from "../../services/drawing-room";
import { fetchUserById, getUserSession } from "../../services/user";

/**
 * roomId:	This is the ID variable of the current room from the URL, e.g., /room/1. Where 1 is the roomId.
 * owner:	State to keep the object data of the owner/creator of the current room
 * room:	State to keep the array information of the current drawing room.
 * user:	State to keep the object data of the currently logged-in user.
 * session:	State to keep the session of the currently logged-in user.
 * isLoading:	State to determine if HTTP calls are still in progress.
 * participantCount:	State to keep track of the number of users joining a room.
 * canEnterRoom:	Condition to determine if a user has access to enter a room. A user can only enter a room if they're the owner of the room or the room visibility is made public.
 */

const DrawingRoomPage = () => {
  const { roomId } = useParams();
  const [owner, setOwner] = useState<any | null>(null);
  const [room, setRoom] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [session, setSession] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [participantCount, setParticipantCount] = useState<number>(0);

  useEffect(() => {
    getUserSession().then((session) => {
      setSession(session);
      setUser(session?.user);

      fetchDrawingRoomById(roomId as string).then((room) => {
        const canEnterRoom =
          room![0].isPublic || room![0].owner === session?.user?.id;

        if (!canEnterRoom) {
          return (window.location.href = "/");
        }
        setRoom(room![0]);
        setIsLoading(false);
        fetchUserById(room![0].owner).then((res) => {
          setOwner(res.user);
        });
      });
    });
  }, []);

  return (
    <main>
      <Navbar
        session={session}
        owner={owner}
        room={room}
        isRoom
        isLoadingRoom={isLoading}
        participantCount={participantCount}
      />
      <BoardContainer room={room} />
    </main>
  );
};

export default DrawingRoomPage;
