"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Indication } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  kode: z.string().min(1),
  name: z.string().min(1),
});

type IndicationFormValues = z.infer<typeof formSchema>

interface IndicationFormProps {
  initialData: Indication | null;
};

export const IndicationForm: React.FC<IndicationFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Gejala' : 'Tambah Gejala';
  const description = initialData ? 'Edit gejala ini.' : 'Tambah gejala baru';
  const toastMessage = initialData ? 'Gejala berhasil diedit.' : 'Gejala berhasil ditambahkan.';
  const action = initialData ? 'Simpan' : 'Tambahkan';

  const form = useForm<IndicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      kode: '',
      name: '',
    }
  });

  const onSubmit = async (data: IndicationFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/indications/${params.indicationId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/indications`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/indications`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Seperti ada yang salah.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/indications/${params.indicationId}`);
      router.refresh();
      router.push(`/${params.storeId}/indications`);
      toast.success('Gejala berhasil dihapus.');
    } catch (error: any) {
      toast.error('Pastikan tidak ada elemen lain yang menggunakan elemen ini.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Gejala</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Contoh -> G004" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gejala</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Motor susah dinyalakan" {...field} />
                  </FormControl>
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
