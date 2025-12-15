'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { TableSkeleton } from '@/components/shared/LoadingState';
import { showSuccess, showError } from '@/lib/notifications';
import { Plus, Edit, Eye, ArrowUpDown, X, MapPin, Power } from 'lucide-react';
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


export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  // Filters
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState<string>('all');

  // Default Sort: Code Descending (Newest logic)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'code', 
    direction: 'desc' 
  });

  const { data: locations } = useLocations();
  const { data: propertyTypes } = usePropertyTypes();

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['admin-properties', currentPage, pageSize, sortConfig, selectedLocationId, selectedPropertyTypeId],
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

      const res = await api.get(`/api/v1/properties?${params.toString()}`);
      return res.data;
    },
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(0);
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

  const handleStatusToggle = (property: any) => {
    const newStatus = property.status === 'ACTIVE' ? 'DELETED' : 'ACTIVE';
    updateStatusMutation.mutate({
      id: property.id,
      status: newStatus,
      name: property.name,
    });
  };

  const properties = propertiesData?.data?.content || [];
  const totalPages = propertiesData?.data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedLocationId('all');
    setSelectedPropertyTypeId('all');
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your villa listings</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
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

          {(selectedLocationId !== 'all' || selectedPropertyTypeId !== 'all') && (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4">
                    <TableSkeleton rows={5} columns={8} />
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/properties/${property.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/properties/${property.id}/edit`}>
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


    </div>
  );
}
