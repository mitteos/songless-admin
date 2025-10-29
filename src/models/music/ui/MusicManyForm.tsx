import {
  Button,
  Input,
  Loader,
  Modal,
  MultiSelect,
  Select,
  Text,
} from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useGenreStore } from "../../genre/store";
import { useYearStore } from "../../year/store";
import { useMusicStore } from "../store";
import { usePlaylistStore } from "../../playlist/store";
// import { useMusicStore } from "../store";

interface MusicManyFormProps {
  opened: boolean;
  close: () => void;
}

type Inputs = {
  genre: string;
  year: string;
  playlistIds: string[];
};

export const MusicManyForm: React.FC<MusicManyFormProps> = ({
  opened,
  close,
}) => {
  const { handleSubmit, control, reset } = useForm<Inputs>();

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { createManyMusic, isManyUploading } = useMusicStore();
  const { genres } = useGenreStore();
  const { years } = useYearStore();
  const { playlists } = usePlaylistStore();

  const dropFiles = (data: File[]) => {
    setFiles((prev) => [...prev, ...data]);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("genreId", data.genre);
    formData.append("yearId", data.year);
    formData.append("playlistIds", data.playlistIds.join(","));
    files.forEach((item) => {
      formData.append("audio_url", item, item.name);
    });

    console.log([...formData.entries()]); // можно посмотреть содержимое

    await createManyMusic(formData);
    setFiles([]);
    reset();
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title="Добавление трека">
      <p className="text-center text-[12px]">
        ВАЖНО: Все треки должны обязательно иметь метаданные с названием и
        автором
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

        <Input.Wrapper
          label="Плейлист"
          description="Можно добавить сразу в плейлист или несколько плейлистов"
        >
          <Controller
            name="playlistIds"
            control={control}
            render={({ field, fieldState }) => (
              <MultiSelect
                label=""
                placeholder="Pick value"
                data={playlists.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                {...field}
                error={fieldState.error?.message}
                clearable
                searchable
              />
            )}
          />
        </Input.Wrapper>

        <Dropzone onDrop={dropFiles}>
          <Text ta="center">Drop audio here</Text>
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
          {isManyUploading ? <Loader /> : "Добавить"}
        </Button>
      </form>
    </Modal>
  );
};
