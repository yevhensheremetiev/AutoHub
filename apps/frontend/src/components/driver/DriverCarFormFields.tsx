import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { DriverCarFormValues } from "@/pages/driver/driverCarFormSchema";
import { Text } from "@/components/ui/text";

type DriverCarFormFieldsProps = {
  form: UseFormReturn<DriverCarFormValues>;
};

export function DriverCarFormFields({ form }: DriverCarFormFieldsProps) {
  const { t } = useTranslation();
  const { register, formState } = form;

  return (
    <>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          {t("driver.addCar.makeLabel")}
        </label>
        <input
          type="text"
          {...register("make")}
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("driver.addCar.makePlaceholder")}
        />
        {formState.errors.make ? (
          <Text className="text-xs text-destructive">
            {formState.errors.make.message}
          </Text>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          {t("driver.addCar.modelLabel")}
        </label>
        <input
          type="text"
          {...register("model")}
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("driver.addCar.modelPlaceholder")}
        />
        {formState.errors.model ? (
          <Text className="text-xs text-destructive">
            {formState.errors.model.message}
          </Text>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          {t("driver.addCar.yearLabelOptional")}
        </label>
        <input
          type="number"
          inputMode="numeric"
          {...register("year")}
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("driver.addCar.yearPlaceholder")}
        />
        {formState.errors.year ? (
          <Text className="text-xs text-destructive">
            {formState.errors.year.message}
          </Text>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-200">
          {t("driver.addCar.plateLabel")}
        </label>
        <input
          type="text"
          {...register("plate")}
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("driver.addCar.platePlaceholder")}
        />
        {formState.errors.plate ? (
          <Text className="text-xs text-destructive">
            {formState.errors.plate.message}
          </Text>
        ) : null}
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label className="block text-sm font-medium text-slate-200">
          {t("driver.addCar.vinLabelOptional")}
        </label>
        <input
          type="text"
          {...register("vin")}
          maxLength={17}
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-sm uppercase placeholder:normal-case text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("driver.addCar.vinPlaceholder")}
        />
        {formState.errors.vin ? (
          <Text className="text-xs text-destructive">
            {formState.errors.vin.message}
          </Text>
        ) : null}
      </div>
    </>
  );
}
