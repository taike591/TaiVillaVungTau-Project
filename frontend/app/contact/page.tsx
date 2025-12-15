'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/lib/notifications";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react";

// Inner component that uses useSearchParams
function ContactForm({ initialPropertyCode }: { initialPropertyCode: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    note: '',
    propertyCode: initialPropertyCode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/v1/requests', {
        customerName: formData.customerName || undefined,
        phoneNumber: formData.phoneNumber,
        note: formData.note || undefined,
        propertyCode: formData.propertyCode || undefined,
      });
      
      showSuccess.custom('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          customerName: '',
          phoneNumber: '',
          note: '',
          propertyCode: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      showError.custom(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-xl border-0">
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Gửi yêu cầu thành công!</h3>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ lại trong thời gian sớm nhất.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Gửi yêu cầu khác
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin của bạn</h2>
            <p className="text-gray-600 text-sm">Vui lòng điền đầy đủ thông tin để chúng tôi hỗ trợ tốt nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName" className="text-sm font-semibold text-gray-700">
                Họ và tên
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="mt-1.5 h-12"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="0868947734"
                className="mt-1.5 h-12"
              />
            </div>
          </div>

          {initialPropertyCode && (
            <div>
              <Label htmlFor="propertyCode" className="text-sm font-semibold text-gray-700">
                Mã căn quan tâm
              </Label>
              <Input
                id="propertyCode"
                value={formData.propertyCode}
                onChange={(e) => setFormData({ ...formData, propertyCode: e.target.value })}
                placeholder="MS208"
                className="mt-1.5 h-12"
              />
            </div>
          )}

          <div>
            <Label htmlFor="note" className="text-sm font-semibold text-gray-700">
              Ghi chú / Yêu cầu đặc biệt
            </Label>
            <textarea
              id="note"
              rows={5}
              className="mt-1.5 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Ví dụ: Tôi muốn thuê villa cho 10 người, ngày 15/1, có hồ bơi..."
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] hover:from-[#0891b2] hover:to-[#0c4a6e] transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Gửi Yêu Cầu
              </span>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Bằng cách gửi yêu cầu, bạn đồng ý với chính sách bảo mật của chúng tôi
          </p>
        </form>
      )}
    </Card>
  );
}

// Component that handles search params (must be wrapped in Suspense)
function ContactFormWithParams() {
  const searchParams = useSearchParams();
  const propertyCode = searchParams?.get('propertyCode') || '';
  return <ContactForm initialPropertyCode={propertyCode} />;
}

// Loading fallback for Suspense
function ContactFormLoading() {
  return (
    <Card className="p-6 md:p-8 shadow-xl border-0">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-14 bg-gray-200 rounded"></div>
      </div>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section - Beautiful Background */}
      <section className="relative text-white py-14 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[10s] ease-out"
            style={{ backgroundImage: 'url("/vungtau.jpg")' }}
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent" />
        </div>

        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
           <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <div className="text-center animate-in slide-in-from-left-10 duration-700 fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-blue-200 mb-3 backdrop-blur-sm bg-black/20 inline-flex px-3 py-1 rounded-full border border-white/10">
              <Send className="w-3 h-3" />
              <span>/</span>
              <span className="text-white font-medium">Liên hệ nhanh</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg text-white">
              Gửi Yêu Cầu Tư Vấn
            </h1>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg text-blue-50 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và hỗ trợ bạn trong thời gian sớm nhất
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                <Phone className="w-4 h-4" />
                <span className="font-medium">Tư vấn 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Miễn phí</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-default">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Phản hồi nhanh</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-16 md:h-24 opacity-90" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
             <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32V74H1392C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74H0V32Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Contact Form - 2 columns */}
              <div className="lg:col-span-2">
                <Suspense fallback={<ContactFormLoading />}>
                  <ContactFormWithParams />
                </Suspense>
              </div>

              {/* Contact Info Sidebar - 1 column */}
              <div className="space-y-6">
                <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-cyan-50 to-blue-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                  <div className="space-y-4">
                    <a 
                      href="tel:0868947734"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Hotline</p>
                        <p className="text-base font-bold text-gray-900">0868-947-734</p>
                        <p className="text-xs text-gray-500">Thanh Tài</p>
                      </div>
                    </a>

                    <a 
                      href="https://zalo.me/84868947734"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Chat Zalo</p>
                        <p className="text-base font-bold text-gray-900">0868-947-734</p>
                        <p className="text-xs text-gray-500">Phản hồi nhanh</p>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Địa chỉ</p>
                        <p className="text-sm text-gray-900">43A La Văn Cầu</p>
                        <p className="text-xs text-gray-500">TP. Vũng Tàu</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Giờ làm việc</p>
                        <p className="text-sm text-gray-900">7:00 - 22:00</p>
                        <p className="text-xs text-gray-500">Hàng ngày</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Tại sao chọn chúng tôi?</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Tư vấn miễn phí 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Villa chất lượng, giá tốt nhất</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Hỗ trợ đặt phòng nhanh chóng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Kinh nghiệm Host & Sale</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

