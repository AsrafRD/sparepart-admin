"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Rule, Indication, Problem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";

const FormSchema = z.object({
  kondisi: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  hasil: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type RuleFormValues = z.infer<typeof FormSchema>;

interface problemFormProps {
  initialData: Rule | null;
  problems: Problem[];
  indications: Indication[];
}

export const RuleForm: React.FC<problemFormProps> = ({
  initialData,
  problems,
  indications,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Kerusakan" : "Tambah Kerusakan";
  const description = initialData
    ? "Edit kerusakan ini."
    : "Tambah kerusakan baru";
  const toastMessage = initialData
    ? "Kerusakan berhasil diedit."
    : "Kerusakan berhasil ditambahkan.";
  const action = initialData ? "Simpan" : "Tambahkan";

  const defaultValues = initialData
    ? {
        ...initialData,
        kondisi: Array.isArray(initialData.kondisi)
          ? initialData.kondisi
          : [initialData.kondisi],
        hasil: Array.isArray(initialData.hasil)
          ? initialData.hasil
          : [initialData.hasil],
      }
    : {
        kondisi: [""],
        hasil: [""],
      };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  
  const convertToItemObject = (selectedItems: any) => {
    return selectedItems.map((name: string) => {
      const item = indications.find((indication) => indication.name === name) || 
                   problems.find((problem) => problem.name === name);
  
      // Periksa apakah item ditemukan sebelum mengakses properti id dan name
      if (item) {
        return {
          id: item.id,
          name: item.name,
        };
      }
  
      return null; // Atau tangani kasus ini sesuai kebutuhan Anda
    }).filter(Boolean); // Hilangkan nilai null jika ada
  };
  
  const onSubmit = async (data: RuleFormValues) => {
    try {
      setLoading(true);
  
      // Konversi nama item menjadi objek dengan ID dan nama
      const kondisiItems = convertToItemObject(data.kondisi);
      const hasilItems = convertToItemObject(data.hasil);
  
      const requestData = {
        kondisi: kondisiItems,
        hasil: hasilItems,
      };
  
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/rules/${params.ruleId}`, requestData);
      } else {
        await axios.post(`/api/${params.storeId}/rules`, requestData);
      }
  
      router.refresh();
      router.push(`/${params.storeId}/rules`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Seperti ada yang salah.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/rules/${params.ruleId}`);
      router.refresh();
      router.push(`/${params.storeId}/rules`);
      toast.success("Kerusakan berhasil dihapus.");
    } catch (error: any) {
      toast.error(
        "Pastikan tidak ada elemen lain yang menggunakan elemen ini."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 md:space-y-0 md:grid md:grid-cols-2"
        >
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="kondisi"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      PILIH PENYEBAB KERUSAKAN
                    </FormLabel>
                  </div>
                  {indications.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="kondisi"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.name)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.name,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.name
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1">
            <FormField
              control={form.control}
              name="hasil"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      PILIH HASIL BERDASAR PENYEBAB KERUSAKAN
                    </FormLabel>
                  </div>
                  {problems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="hasil"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.name)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.name,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.name
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
