import { Button, Input, Modal } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useGenreStore } from "../store";

interface GenreFormProps {
  opened: boolean;
  close: () => void;
}

type Inputs = {
  name: string;
};

export const GenreForm: React.FC<GenreFormProps> = ({ opened, close }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { createGenre } = useGenreStore();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createGenre({ name: data.name });
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title="Добавление жанра">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input.Wrapper label="Название жанра" error={errors.name?.message}>
          <Input {...register("name", { required: true })} />
        </Input.Wrapper>
        <Button type="submit" className="w-full">
          Добавить
        </Button>
      </form>
    </Modal>
  );
};
