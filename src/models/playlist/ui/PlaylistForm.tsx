import { Button, Group, Input, Modal, MultiSelect, Text } from "@mantine/core";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { usePlaylistStore } from "../store";
import { useEffect, useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import { useMusicStore } from "../../music/store";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

interface PlaylistFormProps {
  opened: boolean;
  close: () => void;
}

type Inputs = {
  name: string;
  musics: string[];
};

export const PlaylistForm: React.FC<PlaylistFormProps> = ({
  opened,
  close,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<Inputs>();

  const { createPlaylist } = usePlaylistStore();
  const { musics } = useMusicStore();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const dropFiles = (data: File[]) => {
    console.log(data);
    setFiles((prev) => [...prev, ...data]);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("musics", JSON.stringify(data.musics));
    formData.append("image", files[0]);

    await createPlaylist(formData);
    setFiles([]);
  };

  // Предпросмотр изображения через объектный URL и корректная очистка
  useEffect(() => {
    if (files.length > 0 && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [files]);

  return (
    <Modal opened={opened} onClose={close} title="Добавление плейлиста">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input.Wrapper label="Название плейлиста" error={errors.name?.message}>
          <Input {...register("name", { required: true })} />
        </Input.Wrapper>

        <Input.Wrapper label="Треки">
          <Controller
            name="musics"
            control={control}
            render={({ field, fieldState }) => (
              <MultiSelect
                placeholder="Выберите треки"
                data={musics.map((item) => ({
                  value: String(item.id),
                  label: `${item.author} - ${item.name}`,
                }))}
                {...field}
                error={fieldState.error?.message}
                clearable
                searchable
              />
            )}
          />
        </Input.Wrapper>

        {files.length ? (
          <Button onClick={() => setFiles([])} variant="outline">
            Очистить превью
          </Button>
        ) : (
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
                  Drag&drop image preview
                </Text>
              </div>
            </Group>
          </Dropzone>
        )}
        {previewUrl && (
          <div>
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              <img
                src={previewUrl}
                alt={""}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {watch("name")}
                </h3>

                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <IconPlayerPlayFilled className="w-5 h-5" />
                  <span>Играть</span>
                </div>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 rounded-2xl transition-colors pointer-events-none" />
            </div>
          </div>
        )}
        <Button type="submit" className="w-full">
          Добавить
        </Button>
      </form>
    </Modal>
  );
};
