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

      {/* Create Dialog - Custom Modal like SmartImport */}
      {isCreateDialogOpen && (
        <div
          onClick={() => setIsCreateDialogOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Thêm tiện ích mới</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Tạo một tiện ích mới cho các villa
                </p>
              </div>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  Tên tiện ích <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <Input
                  {...createForm.register('name')}
                  placeholder="VD: Bể bơi"
                />
                {createForm.formState.errors.name && (
                  <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '4px' }}>
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                  Icon Code (tùy chọn)
                </label>
                <Input
                  {...createForm.register('icon')}
                  placeholder="VD: wifi, pool, parking"
                />
                {createForm.formState.errors.icon && (
                  <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '4px' }}>
                    {createForm.formState.errors.icon.message}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog - Custom Modal */}
      {deleteConfirmId !== null && (
        <div
          onClick={() => setDeleteConfirmId(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Xác nhận xóa</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Bạn có chắc chắn muốn xóa tiện ích này? Hành động này không thể hoàn tác.
              </p>
              {amenities.find((a) => a.id === deleteConfirmId) && (
                <p style={{ fontWeight: '500', marginTop: '8px' }}>
                  Tiện ích: {amenities.find((a) => a.id === deleteConfirmId)?.name}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
