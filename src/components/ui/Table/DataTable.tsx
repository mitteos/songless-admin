import { Table, ActionIcon, Group, type TableData } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { UseMutateFunction } from "@tanstack/react-query";
import type React from "react";

interface DataTableProps {
  data: TableData;
  deleteFn: UseMutateFunction<void, Error, string, unknown>;
}

export const DataTable: React.FC<DataTableProps> = ({ data, deleteFn }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {data.head?.map((el, i) => (
            <Table.Th key={i}>{el}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.body?.map((element, i) => (
          <Table.Tr key={i}>
            {element.map((item, i) => (
              <Table.Td key={i}>{item}</Table.Td>
            ))}
            <Table.Td className="w-[100px]">
              <Group gap="xs">
                <ActionIcon variant="subtle" color="blue" title="Редактировать">
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => deleteFn(element[0]?.toString() || "")}
                  title="Удалить"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
