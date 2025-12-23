import { z } from 'zod';

/**
 * Property validation schema
 * Validates all property form fields according to requirements 6.1-6.5
 */
export const propertySchema = z.object({
  code: z
    .string()
    .min(3, 'Mã property phải có ít nhất 3 ký tự')
    .max(20, 'Mã property không được quá 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã property chỉ được chứa chữ in hoa và số'),
  
  name: z
    .string()
    .min(5, 'Tên property phải có ít nhất 5 ký tự')
    .max(200, 'Tên property không được quá 200 ký tự'),
  
  description: z
    .string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(2000, 'Mô tả không được quá 2000 ký tự'),
  
  locationId: z.number().min(1, 'Vui lòng chọn vị trí'),
  propertyTypeId: z.number().min(1, 'Vui lòng chọn loại hình').optional(), // Optional for backward compatibility, or required if needed
  
  area: z.string().optional(),
  
  address: z.string().optional(),
  
  location: z.string().optional(),
  
  priceWeekday: z
    .number({ message: 'Giá ngày thường phải là số' })
    .positive('Giá ngày thường phải lớn hơn 0')
    .min(100000, 'Giá ngày thường phải ít nhất 100,000 VND'),
  
  priceWeekend: z
    .number({ message: 'Giá cuối tuần phải là số' })
    .positive('Giá cuối tuần phải lớn hơn 0')
    .min(100000, 'Giá cuối tuần phải ít nhất 100,000 VND'),
  
  bedroomCount: z
    .number({ message: 'Số phòng ngủ phải là số' })
    .int('Số phòng ngủ phải là số nguyên')
    .positive('Số phòng ngủ phải lớn hơn 0')
    .max(20, 'Số phòng ngủ không được quá 20'),
  
  bathroomCount: z
    .number({ message: 'Số phòng tắm phải là số' })
    .int('Số phòng tắm phải là số nguyên')
    .positive('Số phòng tắm phải lớn hơn 0')
    .max(20, 'Số phòng tắm không được quá 20'),
  
  bedCount: z
    .number({ message: 'Số giường phải là số' })
    .int('Số giường phải là số nguyên')
    .positive('Số giường phải lớn hơn 0')
    .optional(),
  
  standardGuests: z
    .number({ message: 'Số khách tiêu chuẩn phải là số' })
    .int('Số khách tiêu chuẩn phải là số nguyên')
    .positive('Số khách tiêu chuẩn phải lớn hơn 0')
    .max(50, 'Số khách tiêu chuẩn không được quá 50'),
  
  maxGuests: z
    .number({ message: 'Số khách tối đa phải là số' })
    .int('Số khách tối đa phải là số nguyên')
    .positive('Số khách tối đa phải lớn hơn 0')
    .max(50, 'Số khách tối đa không được quá 50'),
  
  bedConfig: z.string().optional(),
  
  distanceToSea: z.string().optional(),
  
  priceNote: z.string().optional(),
  
  mapUrl: z.string().url('URL bản đồ không hợp lệ').optional().or(z.literal('')),
  
  facebookLink: z.string().url('Link Facebook không hợp lệ').optional().or(z.literal('')),
  
  metaDescription: z.string().max(500, 'Meta description không được quá 500 ký tự').optional(),
  
  amenityIds: z.array(z.number()),

  labelIds: z.array(z.number()).optional(), // Labels like "Sát biển", "View biển"
  
  images: z
    .array(z.any())
    .min(1, 'Phải có ít nhất 1 ảnh')
    .max(20, 'Không được quá 20 ảnh'),
  
  status: z.enum(['ACTIVE', 'INACTIVE']),
}).refine(
  (data) => data.maxGuests >= data.standardGuests,
  {
    message: 'Số khách tối đa phải lớn hơn hoặc bằng số khách tiêu chuẩn',
    path: ['maxGuests'],
  }
);

/**
 * Contact/Customer Request validation schema
 * Validates contact form fields according to requirements 6.1-6.3
 */
export const contactSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự'),
  
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
  
  email: z
    .string()
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')),
  
  checkInDate: z.string().optional(),
  
  checkOutDate: z.string().optional(),
  
  guestCount: z
    .number({ message: 'Số khách phải là số' })
    .int('Số khách phải là số nguyên')
    .positive('Số khách phải lớn hơn 0')
    .optional(),
  
  message: z
    .string()
    .max(1000, 'Tin nhắn không được quá 1000 ký tự')
    .optional(),
});

/**
 * Amenity validation schema
 */
export const amenitySchema = z.object({
  name: z
    .string()
    .min(2, 'Tên tiện ích phải có ít nhất 2 ký tự')
    .max(100, 'Tên tiện ích không được quá 100 ký tự'),
  
  icon: z.string().optional(),
  
  category: z.string().optional(),
});

/**
 * Image file validation schema
 */
export const imageFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Kích thước file không được quá 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'
    ),
});

// Type exports for TypeScript
export type PropertyFormData = z.infer<typeof propertySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type AmenityFormData = z.infer<typeof amenitySchema>;
export type ImageFileData = z.infer<typeof imageFileSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type PropertyTypeFormData = z.infer<typeof propertyTypeSchema>;
export type LabelFormData = z.infer<typeof labelSchema>;

/**
 * Location validation schema
 */
export const locationSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên vị trí phải có ít nhất 2 ký tự')
    .max(100, 'Tên vị trí không được quá 100 ký tự'),
  
  slug: z.string().optional(),
  
  description: z.string().optional(),
});

/**
 * Property Type validation schema
 */
export const propertyTypeSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên loại hình phải có ít nhất 2 ký tự')
    .max(50, 'Tên loại hình không được quá 50 ký tự'),
  
  slug: z.string().optional(),
  
  iconCode: z.string().optional(),
});

/**
 * Label validation schema
 */
export const labelSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên label phải có ít nhất 2 ký tự')
    .max(50, 'Tên label không được quá 50 ký tự'),
  
  color: z.string().max(7, 'Mã màu tối đa 7 ký tự').optional(),
  
  iconCode: z.string().optional(),
});
