'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Eye, CheckCircle } from 'lucide-react';
import { showSuccess, showError } from '@/lib/notifications';
import { format } from 'date-fns';

export default function RequestsPage() {
  const queryClient = useQueryClient();

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const res = await api.get('/api/v1/requests');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await api.put(`/api/v1/requests/${id}`, { status });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['admin-requests'] });
      showSuccess.updated('Request status');
    },
    onError: (error: any) => {
      showError.update('request status');
    },
  });

  const requests = requestsData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge className="bg-blue-600">Mới</Badge>;
      case 'CONTACTED':
        return <Badge className="bg-yellow-600">Đã liên hệ</Badge>;
      case 'CLOSED':
        return <Badge className="bg-green-600">Đã chốt</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Requests</h1>
        <p className="text-gray-600 mt-1">Manage consultation and booking requests</p>
      </div>

      {/* Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã căn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Chưa có yêu cầu nào
                  </td>
                </tr>
              ) : (
                requests.map((request: any) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.customerName || 'Không có tên'}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {request.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`tel:${request.phoneNumber}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {request.phoneNumber}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.propertyCode ? (
                        <Badge variant="outline" className="font-mono font-bold">
                          {request.propertyCode}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {request.note || <span className="text-gray-400">Không có ghi chú</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.createdAt ? format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <select
                          className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={request.status}
                          onChange={(e) => {
                            updateStatusMutation.mutate({
                              id: request.id,
                              status: e.target.value,
                            });
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value="NEW">Mới</option>
                          <option value="CONTACTED">Đã liên hệ</option>
                          <option value="CLOSED">Đã chốt</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
