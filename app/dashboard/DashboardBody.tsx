"use client";

import { fetchUserDrawingRooms } from "@/app/services/drawing-room";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import NewRoomModal from "./NewRoomModal";
import { RoomCard, RoomCardSkeleton } from "./RoomCard";

/**
 * RoomType:	This is the room type, this is also exported to be used in the RoomCard.tsx file component.
 * DashboardBody:	Accept only the session prop, we'll use this to fetch the users' drawing rooms from the useEffect.
 * hasNotCreatedARoom:	A condition that the user has not created any room.
 * hasAtLeastOneRoom:	A condition that the user does not have zero rooms.
 * shouldShowRoom:	Condition that the room has been loaded and the user has at least a room that we can display.
 * loadUserDrawingRooms:	We're using this function to load the users' drawing rooms and also passing it as a prop to the NewRoomModal.
 */
export type RoomType = {
  id: string;
  name: string;
  created_at: string;
  isPublic: boolean;
};

type Props = {
  session: any;
};

const DashboardBody = (props: Props) => {
  const { session } = props;
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  const [rooms, setRooms] = useState<RoomType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState<boolean>(false);

  // Conditions
  const hasNotCreatedARoom = !loading && rooms?.length === 0;
  const hasAtLeastOneRoom = rooms && rooms!.length >= 0;
  const shouldShowRoom = !loading && hasAtLeastOneRoom;

  const loadUserDrawingRooms = async () => {
    return fetchUserDrawingRooms(session?.user?.id).then((res) => {
      setRooms(res);
    });
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadUserDrawingRooms().then((res) => {
        setLoading(false);
      });
    }
  }, [session?.user?.id]);

  return (
    <div className="max-w-5xl flex flex-col gap-10 mx-auto px-4 pt-10">
      {isDashboard && (
        <Header
          session={session}
          setShowCreateRoomModal={setShowCreateRoomModal}
        />
      )}

      {hasNotCreatedARoom && (
        <p className="text-slate-600 text-center mt-3">
          Your drawing rooms will display here when you create new rooms.
        </p>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {loading && (
          <>
            {Array(5)
              .fill(5)
              .map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
          </>
        )}

        {shouldShowRoom && (
          <>
            {rooms?.map(({ id, name, created_at, isPublic }) => (
              <RoomCard
                key={id}
                id={id}
                name={name}
                created_at={created_at}
                isPublic={isPublic}
              />
            ))}
          </>
        )}
      </section>
      <NewRoomModal
        show={showCreateRoomModal}
        setShow={setShowCreateRoomModal}
        loadUserDrawingRooms={loadUserDrawingRooms}
        session={session}
      />
    </div>
  );
};

export default DashboardBody;
