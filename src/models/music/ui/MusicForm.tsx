import { Button, Group, Input, Modal, Select, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconX } from "@tabler/icons-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useGenreStore } from "../../genre/store";
import { useYearStore } from "../../year/store";
import { useState } from "react";
import { useMusicStore } from "../store";

interface MusicFormProps {
  opened: boolean;
  close: () => void;
}

type Inputs = {
  name: string;
  author: string;
  genre: string;
  year: string;
};

export const MusicForm: React.FC<MusicFormProps> = ({ opened, close }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Inputs>();
  const { genres } = useGenreStore();
  const { years } = useYearStore();
  const { createMusic } = useMusicStore();
  const [files, setFiles] = useState<File[]>([]);

  const dropFiles = (data: File[]) => {
    setFiles((prev) => [...prev, ...data]);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("author", data.author);
    formData.append("genreId", data.genre);
    formData.append("yearId", data.year);
    formData.append("audio_url", files[0]); // <-- File объект

    console.log([...formData.entries()]); // можно посмотреть содержимое

    await createMusic(formData);
    setFiles([]);
    reset();
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title="Добавление трека">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input.Wrapper label="Название трека" error={errors.name?.message}>
          <Input {...register("name", { required: true })} />
        </Input.Wrapper>

        <Input.Wrapper label="Автор" error={errors.author?.message}>
          <Input {...register("author", { required: true })} />
        </Input.Wrapper>

        <Input.Wrapper label="Жанр">
          <Controller
            name="genre"
            control={control}
            rules={{ required: "Выберите жанр" }}
            render={({ field, fieldState }) => (
              <Select
                placeholder="Выберите год"
                checkIconPosition="right"
                data={genres.map((item) => ({
                  value: item.id.toString(),
                  label: item.name,
                }))}
                {...field}
                error={fieldState.error?.message}
                searchable
                nothingFoundMessage="Nothing found..."
              />
            )}
          />
        </Input.Wrapper>

        <Input.Wrapper label="Год">
          <Controller
            name="year"
            control={control}
            rules={{ required: "Выберите год" }}
            render={({ field, fieldState }) => (
              <Select
                placeholder="Выберите год"
                checkIconPosition="right"
                data={years.map((item) => ({
                  value: item.id.toString(),
                  label: item.name,
                }))}
                {...field}
                error={fieldState.error?.message}
                searchable
                nothingFoundMessage="Nothing found..."
              />
            )}
          />
        </Input.Wrapper>

        <Dropzone
          onDrop={dropFiles}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
        >
          <Group
            justify="center"
            gap="xl"
            mih={50}
            style={{ pointerEvents: "none" }}
          >
            <div>
              <Text size="xl" inline>
                Drag&drop audio
              </Text>
            </div>
          </Group>
        </Dropzone>
        <div className="flex flex-wrap gap-2">
          {files.length > 0 &&
            files.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1 max-w-[200px] py-1 px-5 rounded-2xl bg-blue-600"
              >
                <p className="text-ellipsis whitespace-nowrap overflow-hidden text-white">
                  {item.name}
                </p>
                <button
                  onClick={() =>
                    setFiles((prev) =>
                      prev.filter((el) => el.name !== item.name)
                    )
                  }
                  className="cursor-pointer flex flex-col justify-center items-center h-full"
                >
                  <IconX size={20} />
                </button>
              </div>
            ))}
        </div>

        <Button type="submit" className="w-full">
          Добавить
        </Button>
      </form>
    </Modal>
  );
};
