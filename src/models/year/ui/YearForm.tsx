import { Button, Input, Modal } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useYearStore } from "../store";

interface YearFormProps {
  opened: boolean;
  close: () => void;
}

type Inputs = {
  name: string;
};

export const YearForm: React.FC<YearFormProps> = ({ opened, close }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { createYear } = useYearStore();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createYear({ name: data.name });
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title="Добавление года">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input.Wrapper label="Название" error={errors.name?.message}>
          <Input {...register("name", { required: true })} />
        </Input.Wrapper>
        <Button type="submit" className="w-full">
          Добавить
        </Button>
      </form>
    </Modal>
  );
};
