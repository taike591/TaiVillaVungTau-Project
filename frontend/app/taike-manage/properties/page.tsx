'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { showSuccess, showError } from '@/lib/notifications';
import { Plus, Edit, Eye, ArrowUpDown, X, MapPin, Power, Trash2, Search, ImageIcon, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { useLocations, usePropertyTypes } from '@/lib/hooks/useLocationsAndTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';



export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Derive currentPage directly from URL
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 0;
  
  const pageSize = 10;
  
  // Filters
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');

  // Permanent delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<any>(null);

  // Default Sort: Code Descending (Newest logic)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'code', 
    direction: 'desc' 
  });

  const { data: locations } = useLocations();
  const { data: propertyTypes } = usePropertyTypes();

  // Keyword tracking for reset page logic
  const [prevKeyword, setPrevKeyword] = useState('');

  // Debounce search keyword and reset page if changed
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      
      // Only reset page if keyword truly changed
      if (searchKeyword !== prevKeyword) {
          setPrevKeyword(searchKeyword);
          // Reset to page 0 on new search
          const params = new URLSearchParams(searchParams.toString());
          params.delete('page');
          router.replace(`?${params.toString()}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword, prevKeyword, searchParams, router]);

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['admin-properties', currentPage, pageSize, sortConfig.key, sortConfig.direction, selectedLocationId, selectedPropertyTypeId, debouncedKeyword],
    staleTime: 0, // Force refetch on every sort change
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      params.append('sort', `${sortConfig.key}_${sortConfig.direction}`);
      
      // Admin sees all statuses (ACTIVE, DELETED, etc.)
      params.append('statusList', 'ACTIVE');
      params.append('statusList', 'DELETED');
      
      if (selectedLocationId && selectedLocationId !== 'all') {
        params.append('locationId', selectedLocationId);
      }
      if (selectedPropertyTypeId && selectedPropertyTypeId !== 'all') {
        params.append('propertyTypeId', selectedPropertyTypeId);
      }
      if (debouncedKeyword) {
        params.append('keyword', debouncedKeyword);
      }

      const res = await api.get(`/api/v1/properties?${params.toString()}`);
      return res.data;
    },
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      const newDirection = prev.key === key 
        ? (prev.direction === 'asc' ? 'desc' : 'asc')
        : 'desc';
      return { key, direction: newDirection as 'asc' | 'desc' };
    });
    // Reset to page 0 on sort
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  
  const renderSortArrow = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
  };

  const updateFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: number; isFeatured: boolean }) => {
      // Only send the isFeatured field to avoid overwriting other fields with null values
      await api.patch(`/api/v1/properties/${id}`, { isFeatured });
    },
    onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ['admin-properties'] });
        showSuccess.updated('Property featured status');
    },
    onError: () => {
        showError.update('property');
    }
  });

  // Direct status toggle mutation (no modal)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, name }: { id: number; status: string; name: string }) => {
      await api.patch(`/api/v1/properties/${id}`, { status });
      return { status, name };
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({ queryKey: ['admin-properties'] });
      if (data.status === 'ACTIVE') {
        showSuccess.custom(`Đã kích hoạt "${data.name}"`);
      } else {
        showSuccess.custom(`Đã vô hiệu hóa "${data.name}"`);
      }
    },
    onError: () => {
      showError.update('property status');
    },
  });

  // Permanent delete mutation (HARD DELETE - irreversible!)
  const permanentDeleteMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await api.delete(`/api/v1/properties/${id}/permanent`);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['admin-properties'] });
      showSuccess.custom('Đã xóa vĩnh viễn Villa và toàn bộ dữ liệu');
      setDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    },
    onError: () => {
      showError.custom('Không thể xóa vĩnh viễn Villa');
    },
  });

  const handleStatusToggle = (property: any) => {
    const newStatus = property.status === 'ACTIVE' ? 'DELETED' : 'ACTIVE';
    updateStatusMutation.mutate({
      id: property.id,
      status: newStatus,
      name: property.name,
    });
  };

  const handlePermanentDelete = (property: any) => {
    setPropertyToDelete(property);
    setDeleteConfirmOpen(true);
  };

  const confirmPermanentDelete = () => {
    if (propertyToDelete) {
      permanentDeleteMutation.mutate({ id: propertyToDelete.id });
    }
  };

  const properties = propertiesData?.data?.content || [];
  const totalPages = propertiesData?.data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    // Update URL to navigate
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
    // No need to set state, URL change will trigger re-render
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedLocationId('all');
    setSelectedPropertyTypeId('all');
    setSearchKeyword('');
    setPrevKeyword(''); // Reset previous keyword tracking
    // Reset URL params (page = 0)
    router.replace('/taike-manage/properties');
    // setCurrentPage(0); // Removed
  };

  const hasActiveFilters = selectedLocationId !== 'all' || selectedPropertyTypeId !== 'all' || searchKeyword.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your villa listings</p>
        </div>
        <Link href="/taike-manage/properties/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tên, địa chỉ, mã villa..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Location</label>
            <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations?.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Property Type</label>
            <Select value={selectedPropertyTypeId} onValueChange={setSelectedPropertyTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes?.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={resetFilters} className="mb-0.5">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Properties Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('code')}
                >
                  <div className="flex items-center">
                    Code
                    {renderSortArrow('code')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {renderSortArrow('name')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {renderSortArrow('type')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {renderSortArrow('location')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price (Weekday)
                    {renderSortArrow('price')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('image_count')}
                >
                  <div className="flex items-center">
                    Images
                    {renderSortArrow('image_count')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('featured')}
                >
                  <div className="flex items-center">
                    Featured
                    {renderSortArrow('featured')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                >
                   <div className="flex items-center">
                    Status
                    {renderSortArrow('status')}
                  </div>
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center">
                    Updated
                    {renderSortArrow('updatedAt')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSheet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                <td colSpan={12} className="px-6 py-4">
                    <TableSkeleton rows={5} columns={8} />
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                properties.map((property: any) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{property.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                      <div className="text-sm text-gray-500">
                        {property.bedroomCount} beds • {property.bathroomCount} baths
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant="outline" className="font-normal">
                        {property.propertyTypeName || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.locationName ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span>{property.locationName}</span>
                        </div>
                      ) : (
                         property.area || property.address || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(property.priceWeekday)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {property.images && property.images.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* Thumbnail Image */}
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              src={property.images.find((img: any) => img.isPrimary)?.imageUrl || property.images[0]?.imageUrl}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {property.images.length}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          No Images
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Switch
                            checked={property.isFeatured || false}
                            onCheckedChange={(checked) => {
                                updateFeaturedMutation.mutate({ id: property.id, isFeatured: checked });
                            }}
                            disabled={updateFeaturedMutation.isPending}
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={property.status === 'DELETED' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                      >
                        {property.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.updatedAt ? (
                        <span title={new Date(property.updatedAt).toLocaleString('vi-VN')}>
                          {new Date(property.updatedAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    {/* Google Sheets URL */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {property.googleSheetsUrl ? (
                        <a
                          href={property.googleSheetsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          title={property.googleSheetsUrl}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="underline">Link</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    {/* Google Sheets Note */}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px]">
                      {property.googleSheetsNote ? (
                        <div className="flex items-start gap-1" title={property.googleSheetsNote}>
                          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{property.googleSheetsNote.substring(0, 50)}{property.googleSheetsNote.length > 50 ? '...' : ''}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/properties/${property.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/taike-manage/properties/${property.id}/edit?page=${currentPage}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(property)}
                          disabled={updateStatusMutation.isPending}
                          title={property.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          <Power className={`h-4 w-4 ${property.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`} />
                        </Button>
                        {/* Permanent Delete - Only shows for DELETED properties */}
                        {property.status === 'DELETED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePermanentDelete(property)}
                            disabled={permanentDeleteMutation.isPending}
                            title="Xóa vĩnh viễn"
                            className="hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">⚠️ Xóa Vĩnh Viễn Villa</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="block">
                  Bạn có chắc chắn muốn <strong className="text-red-600">XÓA VĨNH VIỄN</strong> villa:{' '}
                  <strong>{propertyToDelete?.code} - {propertyToDelete?.name}</strong>?
                </span>
                <span className="block text-red-600 font-semibold">
                  Hành động này sẽ xóa toàn bộ dữ liệu bao gồm:
                </span>
                <ul className="list-disc list-inside text-sm text-red-500">
                  <li>Tất cả hình ảnh trên Cloudinary</li>
                  <li>Liên kết với các tiện ích</li>
                  <li>Dữ liệu villa trong database</li>
                </ul>
                <span className="block text-red-700 font-bold mt-4">
                  ⛔ KHÔNG THỂ KHÔI PHỤC SAU KHI XÓA!
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPermanentDelete}
              disabled={permanentDeleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {permanentDeleteMutation.isPending ? 'Đang xóa...' : 'Xóa Vĩnh Viễn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
