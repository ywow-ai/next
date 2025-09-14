"use client";
import {
  Button,
  Datepicker,
  Label,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { FC, Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import clsx from "clsx";
import { client } from "@/lib/client";

type Data = {
  title: string;
  slug: string;
  startDate: Date | null;
  endDate: Date | null;
  isFree: boolean;
};

const NewEvent: FC = () => {
  const { control, handleSubmit, setValue, watch } = useForm<Data>({
    defaultValues: {
      title: "",
      slug: "",
      startDate: null,
      endDate: null,
      isFree: false,
    },
  });

  const save = async (data: Data) => {
    try {
      // client.api.event.post();
      // client.api.event({ id: "" }).delete();
      // client.api.event({ id: "" }).patch();
    } catch (error) {}
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={handleSubmit(save)}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="title1">
          Nama Event <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Nama event wajib diisi" }}
          render={({ field, fieldState }) => (
            <Fragment>
              <TextInput
                {...field}
                value={field.value}
                id="title1"
                placeholder="Contoh: Anime Festival 2024 • Cosplay Competition ✨"
                color={fieldState.invalid ? "failure" : undefined}
                onChange={({ currentTarget: { value } }) => {
                  field.onChange(value);
                  setValue(
                    "slug",
                    value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-_]/g, "")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "")
                  );
                }}
              />
              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </Fragment>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="slug1">
          Custom URL <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="slug"
          control={control}
          rules={{ required: "Slug wajib diisi" }}
          render={({ field, fieldState }) => (
            <Fragment>
              <TextInput
                {...field}
                value={field.value}
                onChange={({ currentTarget: { value } }) => {
                  field.onChange(
                    value
                      .toLowerCase()
                      .replace(/[^a-z0-9-_]/g, "")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "")
                  );
                }}
                id="slug1"
                placeholder="anime-fest-2024"
                color={fieldState.invalid ? "failure" : undefined}
              />
              <p
                className={clsx(
                  "text-xs",
                  fieldState.invalid ? "text-red-500" : "text-gray-400"
                )}
              >
                Link unik buat event (huruf kecil, angka, dash saja)
              </p>
            </Fragment>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="startDate1">
          Tanggal Mulai <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "Tanggal mulai wajib diisi" }}
          render={({ field, fieldState }) => (
            <Fragment>
              <Datepicker
                id="startDate1"
                label="Pilih Tanggal"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                color={fieldState.invalid ? "failure" : undefined}
              />
              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </Fragment>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="endDate1">
          Tanggal Selesai <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="endDate"
          control={control}
          rules={{ required: "Tanggal selesai wajib diisi" }}
          render={({ field, fieldState }) => (
            <Fragment>
              <Datepicker
                id="endDate1"
                label="Pilih Tanggal"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                color={fieldState.invalid ? "failure" : undefined}
              />
              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </Fragment>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="isFree1" className="flex items-center gap-2">
            Event Gratis
            {watch("isFree") && (
              <span className="text-xs text-green-500">• FREE ENTRY</span>
            )}
          </Label>
          <Controller
            name="isFree"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                id="isFree1"
                checked={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>
        <p className="text-xs text-gray-400">
          {watch("isFree")
            ? "🎉 Yes! Event gratis buat semua wibu! (Tiket tidak diperlukan)"
            : "💸 Event berbayar? Jangan lupa set harga tiketnya nanti~"}
        </p>
      </div>

      <div className="flex justify-end items-center">
        <Button size="sm" color="green" type="submit">
          Buat Event
        </Button>
      </div>
    </form>
  );
};

export default NewEvent;
