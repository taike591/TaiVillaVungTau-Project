package com.taivillavungtau.backend.service;

import com.taivillavungtau.backend.dto.request.CustomerRequestDTO;
import com.taivillavungtau.backend.dto.request.UpdateCustomerRequestDTO;
import com.taivillavungtau.backend.entity.CustomerRequest;
import java.util.List;

public interface CustomerRequestService {

    // Khách hàng gửi yêu cầu
    CustomerRequestDTO createRequest(CustomerRequestDTO requestDTO);

    // Admin: Xem danh sách yêu cầu (Mới nhất lên đầu)
    List<CustomerRequest> getAllRequests();

    // Admin: Cập nhật trạng thái/Ghi chú
    CustomerRequest updateRequest(Long id, UpdateCustomerRequestDTO updateDTO);
}