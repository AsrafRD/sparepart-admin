"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { VehicleType } from "@prisma/client"
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
  name: z.string().min(1),
});

type vehicleTypeFormValues = z.infer<typeof formSchema>

interface vehicleTypeFormProps {
  initialData: VehicleType | null;
};

export const VehicleTypeForm: React.FC<vehicleTypeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Tipe Kendaraan' : 'Tambah Tipe Kendaraan';
  const description = initialData ? 'Edit tipe kendaraan ini.' : 'Tambahkan tipe kendaraan baru';
  const toastMessage = initialData ? 'Tipe kendaraan berhasil diedit.' : 'Tipe kendaraan baru berhasil ditambahkan.';
  const action = initialData ? 'Simpan' : 'Tambahkan';

  const form = useForm<vehicleTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  });

  const onSubmit = async (data: vehicleTypeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/vehicleTypes/${params.vehicleTypeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/vehicleTypes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/vehicleTypes`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Sepertinya ada kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/vehicleTypes/${params.vehicleTypeId}`);
      router.refresh();
      router.push(`/${params.storeId}/vehicleTypes`);
      toast.success('Tipe kendaraan berhasil dihapus.');
    } catch (error: any) {
      toast.error('Pastikan tidak ada elemen lain yang menggunakan elemen tipe kendaraan ini.');
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nama tipe kendaraan" {...field} />
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
