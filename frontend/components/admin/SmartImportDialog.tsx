'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, CheckCircle, AlertCircle, Copy, X } from 'lucide-react';
import { parsePropertyText, validateParsedData, ParsedPropertyData } from '@/lib/utils/propertyParser';

interface SmartImportDialogProps {
  onImport: (data: ParsedPropertyData) => void;
}

export function SmartImportDialog({ onImport }: SmartImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedPropertyData | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleParse = () => {
    if (!inputText.trim()) return;
    const data = parsePropertyText(inputText);
    const missing = validateParsedData(data);
    setParsedData(data);
    setMissingFields(missing);
  };

  const handleImport = () => {
    if (parsedData) {
      onImport(parsedData);
      setOpen(false);
      setInputText('');
      setParsedData(null);
      setMissingFields([]);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const amenityNames: Record<number, string> = {
    1: 'Hồ bơi', 2: 'Điều hòa', 3: 'WiFi', 4: 'Tủ lạnh', 5: 'Máy giặt',
    6: 'Bếp đầy đủ', 7: 'Karaoke', 8: 'Bida', 9: 'BBQ', 10: 'Smart TV',
    13: 'Bãi đỗ xe', 14: 'Gần biển', 16: 'Sân vườn',
  };

  const locationNames: Record<number, string> = {
    1: 'Bãi Sau', 2: 'Bãi Trước', 3: 'Long Cung', 4: 'Bãi Dâu', 5: 'Trung Tâm',
  };

  const propertyTypeNames: Record<number, string> = {
    1: 'Villa', 2: 'Homestay', 3: 'Căn hộ',
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Wand2 className="h-4 w-4 mr-2" />
        Smart Import
      </Button>
    );
  }

  return (
    <>
      {/* Trigger Button (hidden when open) */}
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} style={{ visibility: 'hidden' }}>
        <Wand2 className="h-4 w-4 mr-2" />
        Smart Import
      </Button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
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
        {/* Dialog */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Smart Import</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Paste mô tả property từ Facebook để tự động điền form.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
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

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Văn bản mô tả</label>
                <Button variant="ghost" size="sm" onClick={handlePaste}>
                  <Copy className="h-3 w-3 mr-1" />
                  Paste
                </Button>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste nội dung mô tả villa vào đây..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  resize: 'none',
                  outline: 'none',
                }}
              />
              <Button onClick={handleParse} disabled={!inputText.trim()} className="w-full mt-2">
                <Wand2 className="h-4 w-4 mr-2" />
                Phân tích
              </Button>
            </div>

            {/* Results */}
            {parsedData && (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#16a34a' }}>
                  <CheckCircle className="h-4 w-4" />
                  <span style={{ fontWeight: '500' }}>Kết quả</span>
                </div>

                {missingFields.length > 0 && (
                  <div style={{ 
                    backgroundColor: '#fef3c7', 
                    border: '1px solid #fcd34d', 
                    borderRadius: '6px', 
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '14px' 
                  }}>
                    <AlertCircle className="h-4 w-4 inline mr-1" style={{ color: '#d97706' }} />
                    Thiếu: {missingFields.join(', ')}
                  </div>
                )}

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px',
                  fontSize: '14px' 
                }}>
                  <div><span style={{ color: '#6b7280' }}>Mã:</span> <strong>{parsedData.code || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Loại:</span> <strong>{parsedData.propertyTypeId ? propertyTypeNames[parsedData.propertyTypeId] : '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Vị trí:</span> <strong>{parsedData.locationId ? locationNames[parsedData.locationId] : '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Cách biển:</span> <strong>{parsedData.distanceToSea || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Phòng ngủ:</span> <strong>{parsedData.bedroomCount || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>WC:</span> <strong>{parsedData.bathroomCount || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Giường:</span> <strong>{parsedData.bedCount || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Khách:</span> <strong>{parsedData.standardGuests || '-'}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Giá thường:</span> <strong style={{ color: '#16a34a' }}>{formatPrice(parsedData.priceWeekday)}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Giá cuối tuần:</span> <strong style={{ color: '#16a34a' }}>{formatPrice(parsedData.priceWeekend)}</strong></div>
                  {parsedData.poolArea && (
                    <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#6b7280' }}>Hồ bơi:</span> <strong>{parsedData.poolArea}</strong></div>
                  )}
                </div>

                {parsedData.amenityIds.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '12px' }}>
                    {parsedData.amenityIds.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {amenityNames[id] || `ID ${id}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleImport} disabled={!parsedData}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Điền vào Form
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
