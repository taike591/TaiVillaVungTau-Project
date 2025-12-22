'use client';

import { usePropertyTypes, useDeletePropertyType } from '@/lib/hooks/useLocationsAndTypes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function PropertyTypesPage() {
  const { data: propertyTypes, isLoading } = usePropertyTypes();
  const deletePropertyType = useDeletePropertyType();

  const handleDelete = async (id: number) => {
    try {
      await deletePropertyType.mutateAsync(id);
      toast.success('Xóa loại hình thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa loại hình');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Loại hình
          </h1>
          <p className="text-gray-500 mt-2">
            Danh sách các loại hình bất động sản (Villa, Căn hộ, v.v.).
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/taike-manage/property-types/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm Loại hình
          </Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Tên loại hình</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Icon Code</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : propertyTypes && propertyTypes.length > 0 ? (
              propertyTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-400" />
                      {type.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">
                    {type.slug}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {type.iconCode || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/property-types/${type.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể hoàn tác. Loại hình này sẽ bị xóa khỏi cơ sở dữ liệu.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(type.id)}
                              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  Chưa có loại hình nào. Hãy thêm mới!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
