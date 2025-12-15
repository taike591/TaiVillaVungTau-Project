'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyTypeSchema, PropertyTypeFormData } from '@/lib/validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export interface PropertyTypeFormProps {
  initialData?: PropertyTypeFormData;
  onSubmit: (data: PropertyTypeFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

export function PropertyTypeForm({
  initialData,
  onSubmit,
  isLoading,
  isEdit = false,
}: PropertyTypeFormProps) {
  const form = useForm<PropertyTypeFormData>({
    resolver: zodResolver(propertyTypeSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      iconCode: initialData?.iconCode || '',
    },
  });

  // Watch name to auto-generate slug
  const nameValue = form.watch('name');
  useEffect(() => {
    if (!isEdit && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  }, [nameValue, isEdit, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại hình *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Villa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL) *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: villa" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tự động tạo từ tên, hoặc nhập thủ công
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconCode"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Icon Code (Lucide)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: home" {...field} />
                  </FormControl>
                  <FormDescription>
                     Tên icon từ thư viện Lucide (ví dụ: home, building, castle)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
