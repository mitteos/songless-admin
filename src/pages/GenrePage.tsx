import { Button, type TableData } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DataTable } from "../components/ui/Table/DataTable";
import { GenreForm } from "../models/genre/ui";
import { useGenreStore } from "../models/genre/store";

export default function GenrePage() {
  const [table, setTable] = useState<TableData>({
    head: ["id", "Название жанра"],
  });
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const { genres, deleteGenre } = useGenreStore();

  useEffect(() => {
    setTable((prev) => ({
      head: prev.head,
      body: genres.map((item) => [...Object.values(item)]),
    }));
  }, [genres]);

  return (
    <div className="w-full overflow-y-auto">
      <h1 className="text-3xl text-center my-3 font-bold">Genre page</h1>
      <div className="w-[90%] mx-auto my-5 flex flex-col gap-2">
        <Button w={"100%"} onClick={addOpen}>
          Добавить
        </Button>
      </div>

      <div>
        <DataTable data={table} deleteFn={deleteGenre} />
      </div>
      <GenreForm opened={addOpened} close={addClose} />
    </div>
  );
}
