import { createDrawingRoom } from "@/app/services/drawing-room";
import { useState } from "react";

/**
 * show: A prop boolean value of the current visibility status of the modal.
 * setShow:	A prop function to toggle the visibility of the modal (true/false).
 * loadUserDrawingRooms: A prop unction to load the user drawing rooms.
 * session:	The authenticated user object prop.
 * roomName: A state for the room input text.
 * isPublic: A state for the room visibility status checkbox.
 * isCreatingRoom:	A state to determine when a room is been created.
 */
type Props = {
  show: boolean;
  setShow: Function;
  loadUserDrawingRooms: Function;
  session: any;
};

const NewRoomModal = (props: Props) => {
  const { session, show, setShow, loadUserDrawingRooms } = props;
  const [roomName, setRoomName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  return (
    <>
      {show && (
        <div className="fixed w-full inset-0">
          <div
            className="absolute bg-black/50 w-full h-full"
            onClick={() => !isCreatingRoom && setShow(false)} // prevent closing modal while creating room
          />
          <div className="flex justify-center items-center h-screen">
            <form
              className="bg-white relative z-10 flex flex-col gap-5 p-5 rounded"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsCreatingRoom(true);
                const newRoom = await createDrawingRoom(
                  roomName,
                  session?.user?.id,
                  isPublic
                );
                loadUserDrawingRooms();
                window.location.href = `/room/${newRoom![0].id}`;
              }}
            >
              <h2 className="text-slate-700 text-lg">Create new room</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Room Name"
                  className="border border-slate-300 py-2.5 px-3 rounded"
                  onChange={(e) => setRoomName(e.target.value)}
                  value={roomName}
                />
              </div>
              <div className="flex gap-1 items-center text-slate-700 text-sm">
                <label>Public</label>
                <input
                  type="checkbox"
                  placeholder="Room Name"
                  className="border border-slate-300 rounded"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </div>

              <button
                className="font-semibold text-sm px-2.5 py-2 rounded-full gap-1 bg-blue-600 text-white hover:bg-blue-500"
                type="submit"
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? "Please wait..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewRoomModal;
