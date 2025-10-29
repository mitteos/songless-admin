import { Button, type TableData } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "../components/ui/Table/DataTable";
import { PlaylistForm } from "../models/playlist/ui";
import { usePlaylistStore } from "../models/playlist/store";

export default function PlaylistPage() {
  const [table, setTable] = useState<TableData>({
    head: ["id", "Название", "Обложка", "Треки"],
  });
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const { playlists, deletePlaylist } = usePlaylistStore();

  useEffect(() => {
    const data = playlists.map((item) => {
      return {
        ...item,
        musics: item.musics
          ?.map((el) => `${el.author} - ${el.name}`)
          .join(", "),
      };
    });
    setTable((prev) => ({
      head: prev.head,
      body: data.map((item) => [...Object.values(item)]),
    }));
  }, [playlists]);

  return (
    <div className="w-full overflow-y-auto">
      <h1 className="text-3xl text-center my-3 font-bold">Playlist page</h1>
      <div className="w-[90%] mx-auto my-5 flex flex-col gap-2">
        <Button w={"100%"} onClick={addOpen}>
          Добавить
        </Button>
      </div>

      <div>
        <DataTable data={table} deleteFn={deletePlaylist} />
      </div>
      <PlaylistForm opened={addOpened} close={addClose} />
    </div>
  );
}
