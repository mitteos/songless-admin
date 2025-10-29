import { Button, type TableData } from "@mantine/core";
import { DataTable } from "../components/ui/Table/DataTable";
import { useEffect, useState } from "react";
import { MusicForm, MusicManyForm } from "../models/music/ui";
import { useDisclosure } from "@mantine/hooks";
import { useMusicStore } from "../models/music/store";
import { useGenreStore } from "../models/genre/store";
import { useYearStore } from "../models/year/store";

export default function MusicPage() {
  const [table, setTable] = useState<TableData>({
    head: ["id", "Название", "Автор", "аудио", "жанр", "год", "Дата создания"],
  });
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const [manyOpened, { open: manyOpen, close: manyClose }] =
    useDisclosure(false);
  const { musics, deleteMusic } = useMusicStore();
  const { genres } = useGenreStore();
  const { years } = useYearStore();

  useEffect(() => {
    const data = musics.map((el) => {
      return {
        ...el,
        genreId: genres.find((item) => +item.id === el.genreId)?.name,
        yearId: years.find((item) => +item.id === el.yearId)?.name,
        createdAt: new Date(el.createdAt).toString(),
      };
    });
    console.log(data);
    setTable((prev) => ({
      head: prev.head,
      body: data.map((item) => [...Object.values(item)]),
    }));
  }, [musics, genres, years]);

  return (
    <div className="w-full overflow-y-auto">
      <h1 className="text-3xl text-center my-3 font-bold">Music page</h1>
      <div className="w-[90%] mx-auto my-5 flex flex-col gap-2">
        <Button w={"100%"} onClick={addOpen}>
          Добавить
        </Button>
        <Button onClick={manyOpen}>Загрузить много треков</Button>
      </div>

      <div>
        <DataTable data={table} deleteFn={deleteMusic} />
      </div>
      <MusicForm opened={addOpened} close={addClose} />
      <MusicManyForm opened={manyOpened} close={manyClose} />
    </div>
  );
}
