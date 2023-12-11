"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Image, Product, Order } from "@prisma/client"
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
  statusOrder: z.string().min(1),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Order[]
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit produk' : 'Tambah produk';
  const description = initialData ? 'Kelola produk ini.' : 'Tambah produk baru';
  const toastMessage = initialData ? 'Produk berhasil diedit.' : 'Produk berhasil ditambahkan.';
  const action = initialData ? 'Simpan' : 'Tambahkan';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    statusOrder: '',
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/orders`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/orders`);
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
      await axios.delete(`/api/${params.storeId}/orders/${params.orderId}`);
      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success('Orderan berhasil dihapus.');
    } catch (error: any) {
      toast.error('Pastikan tidak ada elemen lain yang menggunakan elemen produk ini.');
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full h-auto">

          <div className="md:grid md:grid-cols-3 gap-8 space-y-2">
            <FormField
              control={form.control}
              name="statusOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Order</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="isi dengan status order" {...field} />
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
