"use client";

import { useTranslations } from "next-intl";
import { Check, Zap, Building2, MessageCircle, Phone, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import api from "@/lib/api";
import { showSuccess, showError } from "@/lib/notifications";

export default function RequestAdviceSection() {
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/v1/requests', {
        customerName: formData.customerName || undefined,
        phoneNumber: formData.phoneNumber,
        note: formData.note || undefined,
      });
      
      showSuccess.custom('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          customerName: '',
          phoneNumber: '',
          note: ''
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
    <section 
      className="relative py-24 md:py-32 overflow-hidden bg-slate-50"
      aria-labelledby="request-advice-heading"
    >
      <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-cyan-50 border border-cyan-100 shadow-sm shadow-cyan-100/50">
              <MessageCircle className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span className="text-cyan-700 text-xs font-bold uppercase tracking-wider">Hỗ trợ 24/7</span>
            </div>
            <h2 id="request-advice-heading" className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-6 leading-tight">
              Gửi Yêu Cầu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Tư Vấn</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Để lại thông tin, đội ngũ tư vấn sẽ liên hệ bạn sớm nhất có thể.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Miễn phí tư vấn</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Phản hồi nhanh</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">100+ villa</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Gửi yêu cầu thành công!</h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                      <input 
                        type="text" 
                        placeholder="Nguyễn Văn A" 
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="0868 947 734" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
                    <textarea 
                      rows={3} 
                      placeholder="Ví dụ: Villa 10 người, có hồ bơi..." 
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-cyan-400 focus:ring-0 outline-none transition-colors resize-none" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#0c4a6e] to-[#0891b2] text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang gửi...
                      </span>
                    ) : (
                      <>
                        <span>Gửi Yêu Cầu Ngay</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-6 text-sm">
                  <a href="tel:0868947734" className="text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-2 font-medium">
                    <Phone className="w-3.5 h-3.5" />
                    0868.947.734
                  </a>
                  <a href="https://zalo.me/0868947734" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 font-medium">
                    <span className="w-3.5 h-3.5 rounded-sm bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">Z</span>
                    Zalo
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
