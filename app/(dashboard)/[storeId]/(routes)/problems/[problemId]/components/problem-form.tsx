"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Problem } from "@prisma/client"
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

type problemFormValues = z.infer<typeof formSchema>

interface problemFormProps {
  initialData: Problem | null;
};

export const ProblemForm: React.FC<problemFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Kerusakan' : 'Tambah Kerusakan';
  const description = initialData ? 'Edit kerusakan ini.' : 'Tambah kerusakan baru';
  const toastMessage = initialData ? 'Kerusakan berhasil diedit.' : 'Kerusakan berhasil ditambahkan.';
  const action = initialData ? 'Simpan' : 'Tambahkan';

  const form = useForm<problemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      kode: '',
      name: ''
    }
  });

  const onSubmit = async (data: problemFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/problems/${params.problemId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/problems`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/problems`);
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
      await axios.delete(`/api/${params.storeId}/problems/${params.problemId}`);
      router.refresh();
      router.push(`/${params.storeId}/problems`);
      toast.success('Kerusakan berhasil dihapus.');
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
                  <FormLabel>Kode Kerusakan</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Contoh K003" {...field} />
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
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Contoh : Kerusakan pada rantai keteng" {...field} />
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
