import { toast } from 'sonner';

/**
 * Success notification utilities
 */
export const showSuccess = {
  created: (itemName: string = 'Mục') => {
    toast.success(`${itemName} đã được tạo thành công!`);
  },
  
  updated: (itemName: string = 'Mục') => {
    toast.success(`${itemName} đã được cập nhật thành công!`);
  },
  
  deleted: (itemName: string = 'Mục') => {
    toast.success(`${itemName} đã được xóa thành công!`);
  },
  
  saved: (itemName: string = 'Dữ liệu') => {
    toast.success(`${itemName} đã được lưu thành công!`);
  },
  
  uploaded: (itemName: string = 'File') => {
    toast.success(`${itemName} đã được tải lên thành công!`);
  },
  
  custom: (message: string) => {
    toast.success(message);
  },
};

/**
 * Error notification utilities
 */
export const showError = {
  create: (itemName: string = 'mục') => {
    toast.error(`Không thể tạo ${itemName}. Vui lòng thử lại.`);
  },
  
  update: (itemName: string = 'mục') => {
    toast.error(`Không thể cập nhật ${itemName}. Vui lòng thử lại.`);
  },
  
  delete: (itemName: string = 'mục') => {
    toast.error(`Không thể xóa ${itemName}. Vui lòng thử lại.`);
  },
  
  load: (itemName: string = 'dữ liệu') => {
    toast.error(`Không thể tải ${itemName}. Vui lòng thử lại.`);
  },
  
  upload: (itemName: string = 'file') => {
    toast.error(`Không thể tải lên ${itemName}. Vui lòng thử lại.`);
  },
  
  validation: (message: string) => {
    toast.error(message);
  },
  
  custom: (message: string) => {
    toast.error(message);
  },
};

/**
 * Info notification utilities
 */
export const showInfo = {
  loading: (message: string = 'Đang xử lý...') => {
    return toast.loading(message);
  },
  
  custom: (message: string) => {
    toast.info(message);
  },
};

/**
 * Warning notification utilities
 */
export const showWarning = {
  custom: (message: string) => {
    toast.warning(message);
  },
};
