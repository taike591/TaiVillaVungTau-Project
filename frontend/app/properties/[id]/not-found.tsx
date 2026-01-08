import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <Home className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">Villa không tồn tại</h1>
          <p className="text-slate-500 mb-6">Có thể villa đã bị xóa hoặc đường dẫn không chính xác</p>
          <Link href="/properties">
            <Button className="bg-[#0891b2] hover:bg-[#0e7490]">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
