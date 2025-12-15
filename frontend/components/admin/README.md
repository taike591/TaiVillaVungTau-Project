# Admin Components

This directory contains admin-specific components for the TaiVillaVungTau application.

## ImageUploader Component

A comprehensive image upload component with drag-and-drop, reordering, progress tracking, and error handling.

### Features

- ✅ Drag-and-drop file upload
- ✅ Multiple image selection
- ✅ Image preview with thumbnails
- ✅ Drag-and-drop reordering
- ✅ Upload progress tracking
- ✅ Error handling with retry
- ✅ File validation (type and size)
- ✅ Cloudinary API integration
- ✅ Maximum image limit enforcement

### Usage

```tsx
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { toast } from 'sonner';

function PropertyForm() {
  const {
    images,
    addImages,
    removeImage,
    reorderImages,
    uploadAllImages,
    retryUpload,
  } = useImageUpload({
    maxImages: 20,
    maxSizeInMB: 5,
    onError: (error) => toast.error(error),
    onUploadComplete: (imageUrl) => console.log('Uploaded:', imageUrl),
  });

  const handleSubmit = async () => {
    const result = await uploadAllImages(propertyId);
    if (result.success) {
      toast.success('All images uploaded!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploader
        images={images}
        onChange={() => {}}
        onAdd={addImages}
        onRemove={removeImage}
        onReorder={reorderImages}
        onRetry={(id) => retryUpload(id, propertyId)}
        maxImages={20}
        maxSizeInMB={5}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Props

#### ImageUploader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImagePreview[]` | required | Array of image previews |
| `onChange` | `(images: ImagePreview[]) => void` | required | Callback when images change |
| `onAdd` | `(files: File[]) => void` | required | Callback to add new images |
| `onRemove` | `(id: string) => void` | required | Callback to remove an image |
| `onReorder` | `(startIndex: number, endIndex: number) => void` | required | Callback to reorder images |
| `onRetry` | `(imageId: string) => void` | optional | Callback to retry failed upload |
| `maxImages` | `number` | `20` | Maximum number of images allowed |
| `maxSizeInMB` | `number` | `5` | Maximum file size in MB |
| `disabled` | `boolean` | `false` | Disable all interactions |

#### useImageUpload Hook

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxImages` | `number` | `20` | Maximum number of images |
| `maxSizeInMB` | `number` | `5` | Maximum file size in MB |
| `onError` | `(error: string) => void` | optional | Error callback |
| `onUploadComplete` | `(imageUrl: string) => void` | optional | Upload success callback |

### Hook Methods

- `addImages(files: File[])` - Add new images to the list
- `removeImage(id: string)` - Remove an image
- `reorderImages(startIndex: number, endIndex: number)` - Reorder images
- `clearImages()` - Clear all images
- `setExistingImages(urls: string[])` - Load existing images (for edit mode)
- `uploadImage(imageId: string, file: File, propertyId?: number)` - Upload a single image
- `uploadAllImages(propertyId?: number)` - Upload all pending images
- `retryUpload(imageId: string, propertyId?: number)` - Retry a failed upload

### Image States

Images can have the following states:

- **Pending**: File selected but not uploaded yet
- **Uploading**: Upload in progress (shows progress bar)
- **Uploaded**: Successfully uploaded to Cloudinary
- **Error**: Upload failed (shows error message and retry button)

### API Integration

The component integrates with the backend Cloudinary API:

- **Endpoint**: `POST /api/v1/properties/{id}/images`
- **Content-Type**: `multipart/form-data`
- **Response**: `{ data: "https://res.cloudinary.com/..." }`

### Validation

- **Allowed types**: JPEG, JPG, PNG, WebP
- **Max file size**: Configurable (default 5MB)
- **Max images**: Configurable (default 20)

### Error Handling

- Automatic retry (up to 2 retries)
- User-friendly error messages
- Manual retry button for failed uploads
- Toast notifications for errors

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Proper semantic HTML

### Performance

- Object URL cleanup to prevent memory leaks
- Progress tracking for large files
- Optimistic UI updates
- Efficient re-rendering with React hooks
