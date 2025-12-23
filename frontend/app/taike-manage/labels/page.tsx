'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label as FormLabel } from '@/components/ui/label';
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
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { showSuccess, showError } from '@/lib/notifications';

interface Label {
  id: number;
  name: string;
  color?: string;
  iconCode?: string;
}

export default function LabelsPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ name: '', color: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState({ name: '', color: '#0EA5E9', iconCode: '' });

  // Fetch labels
  const { data: labelsData, isLoading } = useQuery({
    queryKey: ['admin-labels'],
    queryFn: async () => {
      const res = await api.get('/api/v1/labels');
      return res.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; color?: string; iconCode?: string }) => {
      await api.post('/api/v1/labels', data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
        queryClient.refetchQueries({ queryKey: ['labels'] }),
      ]);
      showSuccess.created('Label');
      setIsCreateDialogOpen(false);
      setNewLabel({ name: '', color: '#0EA5E9', iconCode: '' });
    },
    onError: () => {
      showError.create('label');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; color?: string } }) => {
      await api.put(`/api/v1/labels/${id}`, data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
        queryClient.refetchQueries({ queryKey: ['labels'] }),
      ]);
      showSuccess.updated('Label');
      setEditingId(null);
    },
    onError: () => {
      showError.update('label');
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/labels/${id}`);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['admin-labels'] }),
        queryClient.refetchQueries({ queryKey: ['labels'] }),
      ]);
      showSuccess.deleted('Label');
      setDeleteConfirmId(null);
    },
    onError: () => {
      showError.delete('label');
      setDeleteConfirmId(null);
    },
  });

  const labels: Label[] = labelsData?.data || [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabel.name.trim().length < 2) {
      showError.validation('Tên label phải có ít nhất 2 ký tự');
      return;
    }
    createMutation.mutate(newLabel);
  };

  const handleStartEdit = (label: Label) => {
    setEditingId(label.id);
    setEditingData({ name: label.name, color: label.color || '#0EA5E9' });
  };

  const handleSaveEdit = (id: number) => {
    if (editingData.name.trim().length < 2) {
      showError.validation('Tên label phải có ít nhất 2 ký tự');
      return;
    }
    updateMutation.mutate({ id, data: editingData });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: '', color: '' });
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Labels</h1>
          <p className="text-gray-600 mt-1">Quản lý các nhãn đặc điểm của villa (VD: Sát biển, View biển)</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm label
        </Button>
      </div>

      {/* Labels Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : labels.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có label nào. Thêm label đầu tiên!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Tên label</TableHead>
                <TableHead className="w-[120px]">Màu</TableHead>
                <TableHead className="w-[150px]">Preview</TableHead>
                <TableHead className="w-[120px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labels.map((label) => (
                <TableRow key={label.id}>
                  <TableCell className="font-medium">{label.id}</TableCell>
                  <TableCell>
                    {editingId === label.id ? (
                      <Input
                        value={editingData.name}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        className="max-w-md"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(label.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        {label.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === label.id ? (
                      <Input
                        type="color"
                        value={editingData.color}
                        onChange={(e) => setEditingData({ ...editingData, color: e.target.value })}
                        className="w-16 h-8 p-0 border-0"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: label.color || '#0EA5E9' }}
                        />
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {label.color || '#0EA5E9'}
                        </code>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-white text-xs font-semibold"
                      style={{ backgroundColor: editingId === label.id ? editingData.color : (label.color || '#0EA5E9') }}
                    >
                      {editingId === label.id ? editingData.name : label.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === label.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveEdit(label.id)}
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
                          onClick={() => handleStartEdit(label)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(label.id)}
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
            <DialogTitle>Thêm label mới</DialogTitle>
            <DialogDescription>
              Tạo một label mới cho các villa (VD: Sát biển, View biển)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <FormLabel htmlFor="name">
                Tên label <span className="text-red-500">*</span>
              </FormLabel>
              <Input
                id="name"
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                placeholder="VD: Sát biển, View biển"
              />
            </div>
            <div>
              <FormLabel htmlFor="color">Màu hiển thị</FormLabel>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  id="color"
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                  placeholder="#0EA5E9"
                  className="flex-1"
                />
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-white text-sm font-semibold"
                  style={{ backgroundColor: newLabel.color }}
                >
                  {newLabel.name || 'Preview'}
                </span>
              </div>
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
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo label'}
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
              Bạn có chắc chắn muốn xóa label này? Hành động này không thể hoàn tác.
              {labels.find((l) => l.id === deleteConfirmId) && (
                <span className="block mt-2">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-white text-xs font-semibold"
                    style={{ backgroundColor: labels.find((l) => l.id === deleteConfirmId)?.color || '#0EA5E9' }}
                  >
                    {labels.find((l) => l.id === deleteConfirmId)?.name}
                  </span>
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
