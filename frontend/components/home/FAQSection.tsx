"use client";

export default function FAQSection() {
  const faqs = [
    {
      q: "Cách thức đặt lịch?",
      a: (
        <ol className="list-decimal list-inside space-y-1">
          <li>Chốt thông tin (ngày, số người, tên khách).</li>
          <li>Cọc 50% tiền villa.</li>
          <li>Nhận bản xác nhận đặt phòng.</li>
          <li>Quản gia liên hệ đón trước giờ check-in.</li>
        </ol>
      )
    },
    {
      q: "Có hình thức nào để kiểm tra uy tín trước khi đặt cọc?",
      a: "Để an toàn và chắc chắn, anh chị có thể đăng bài trên các hội nhóm liên quan đến dịch vụ du lịch Vũng Tàu để tham khảo ý kiến thành viên khác, hoặc kiểm tra các đánh giá trên fanpage chính thức của chúng tôi."
    },
    {
      q: "Số tài khoản chính thức?",
      a: (
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
          <p>STK: 80868947734 (Techcombank)</p>
          <p>Chủ TK: NGUYEN HO THANH TAI</p>
          <p className="mt-2 text-xs font-bold uppercase">⚠️ Chỉ nhận tiền qua STK này!</p>
        </div>
      )
    },
    {
      q: "Giờ check-in và check-out?",
      a: "Giờ nhận nhà (check-in) là 14:00 ngày hôm nay và giờ trả nhà (check-out) là 12:00 ngày hôm sau."
    },
    {
      q: "Có thể hỗ trợ nhận nhà sớm không?",
      a: "Bên mình sẽ hỗ trợ nhận nhà sớm nhất có thể vào lúc 12:00 nếu căn villa đã được dọn dẹp sạch sẽ và sẵn sàng."
    },
    {
      q: "Chính sách huỷ và đổi nhà?",
      a: "Tuỳ từng đối tác và thời điểm đặt phòng, chính sách huỷ/đổi sẽ khác nhau. Vui lòng liên hệ trực tiếp để được tư vấn cụ thể cho từng trường hợp."
    }
  ];

  return (
    <section className="relative py-20 md:py-28 bg-slate-50" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-[#0c4a6e] mb-4">Thông Tin Cần Biết</h2>
          <p className="text-slate-500">Giải đáp các thắc mắc phổ biến của khách hàng</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <summary className="flex items-center gap-4 p-5 cursor-pointer font-semibold text-[#0c4a6e] list-none">
                <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm">{i+1}</span>
                <span className="flex-1">{faq.q}</span>
                <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </summary>
              <div className="px-5 pb-5 pt-1 text-slate-600 text-sm border-t border-slate-50">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
