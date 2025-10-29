import { Button, type TableData } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DataTable } from "../components/ui/Table/DataTable";
import { YearForm } from "../models/year/ui";
import { useYearStore } from "../models/year/store";

export default function YearsPage() {
  const [table, setTable] = useState<TableData>({
    head: ["id", "Год"],
  });
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);
  const { years, deleteYear } = useYearStore();

  useEffect(() => {
    setTable((prev) => ({
      head: prev.head,
      body: years.map((item) => [...Object.values(item)]),
    }));
  }, [years]);

  return (
    <div className="w-full overflow-y-auto">
      <h1 className="text-3xl text-center my-3 font-bold">Year page</h1>
      <div className="w-[90%] mx-auto my-5 flex flex-col gap-2">
        <Button w={"100%"} onClick={addOpen}>
          Добавить
        </Button>
      </div>

      <div>
        <DataTable data={table} deleteFn={deleteYear} />
      </div>
      <YearForm opened={addOpened} close={addClose} />
    </div>
  );
}
