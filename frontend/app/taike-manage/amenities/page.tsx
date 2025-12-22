'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { amenitySchema, type AmenityFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { showSuccess, showError } from '@/lib/notifications';

interface Amenity {
  id: number;
  name: string;
  iconCode?: string;
}

export default function AmenitiesPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch amenities
  const { data: amenitiesData, isLoading } = useQuery({
    queryKey: ['admin-amenities'],
    queryFn: async () => {
      const res = await api.get('/api/v1/amenities');
      return res.data;
    },
  });

  // Create form
  const createForm = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: '',
      icon: '',
      category: '',
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: AmenityFormData) => {
      await api.post('/api/v1/amenities', {
        name: data.name,
        iconCode: data.icon || undefined,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
      ]);
      showSuccess.created('Tiện ích');
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      showError.create('tiện ích');
    },
  });

  // Update mutation (inline edit)
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      // Since backend doesn't have update endpoint, we'll use create/delete workaround
      // For now, just show a message that edit is not supported
      throw new Error('Chức năng chỉnh sửa chưa được hỗ trợ bởi backend');
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
      ]);
      showSuccess.updated('Tiện ích');
      setEditingId(null);
    },
    onError: (error: any) => {
      showError.update('tiện ích');
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/amenities/${id}`);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-amenities'] }),
        queryClient.refetchQueries({ queryKey: ['amenities'] }),
      ]);
      showSuccess.deleted('Tiện ích');
      setDeleteConfirmId(null);
    },
    onError: (error: any) => {
      showError.delete('tiện ích');
      setDeleteConfirmId(null);
    },
  });

  const amenities: Amenity[] = amenitiesData?.data || [];

  const handleCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const handleStartEdit = (amenity: Amenity) => {
    setEditingId(amenity.id);
    setEditingName(amenity.name);
  };

  const handleSaveEdit = (id: number) => {
    if (editingName.trim().length < 2) {
      showError.validation('Tên tiện ích phải có ít nhất 2 ký tự');
      return;
    }
    updateMutation.mutate({ id, name: editingName.trim() });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tiện ích</h1>
          <p className="text-gray-600 mt-1">Quản lý các tiện ích của villa</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm tiện ích
        </Button>
      </div>

      {/* Amenities Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : amenities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có tiện ích nào. Thêm tiện ích đầu tiên!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Tên tiện ích</TableHead>
                <TableHead className="w-[150px]">Icon Code</TableHead>
                <TableHead className="w-[120px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amenities.map((amenity) => (
                <TableRow key={amenity.id}>
                  <TableCell className="font-medium">{amenity.id}</TableCell>
                  <TableCell>
                    {editingId === amenity.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="max-w-md"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(amenity.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                    ) : (
                      amenity.name
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {amenity.iconCode || '-'}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === amenity.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveEdit(amenity.id)}
                          disabled={updateMutation.isPending}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(amenity)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(amenity.id)}
                          disabled={deleteMutation.isPending}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm tiện ích mới</DialogTitle>
            <DialogDescription>
              Tạo một tiện ích mới cho các villa
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">
                Tên tiện ích <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...createForm.register('name')}
                placeholder="VD: Bể bơi"
              />
              {createForm.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="icon">Icon Code (tùy chọn)</Label>
              <Input
                id="icon"
                {...createForm.register('icon')}
                placeholder="VD: wifi, pool, parking"
              />
              {createForm.formState.errors.icon && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.icon.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo tiện ích'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tiện ích này? Hành động này không thể hoàn tác.
              {amenities.find((a) => a.id === deleteConfirmId) && (
                <span className="block mt-2 font-medium">
                  Tiện ích: {amenities.find((a) => a.id === deleteConfirmId)?.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
