package com.taivillavungtau.backend.repository.specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.taivillavungtau.backend.dto.request.PropertySearchRequest;
import com.taivillavungtau.backend.entity.Amenity;
import com.taivillavungtau.backend.entity.Property;

public class PropertySpecification {

    public static Specification<Property> filter(PropertySearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            if (query == null) {
                return criteriaBuilder.conjunction();
            }
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo từ khóa (Cải thiện: tìm cả trong address, code)
            if (StringUtils.hasText(request.getKeyword())) {
                String keyword = "%" + request.getKeyword().toLowerCase().trim() + "%";
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")), keyword);
                Predicate descPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")), keyword);
                Predicate addressPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("address")), keyword);
                Predicate codePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("code")), keyword);

                predicates.add(criteriaBuilder.or(
                        namePredicate, descPredicate, addressPredicate, codePredicate));
            }

            // 2. Lọc theo khoảng giá (Cải thiện: validate min <= max)
            if (request.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("priceWeekday"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("priceWeekday"), request.getMaxPrice()));
            }
            // Đảm bảo minPrice <= maxPrice nếu cả 2 đều có
            if (request.getMinPrice() != null && request.getMaxPrice() != null) {
                if (request.getMinPrice().compareTo(request.getMaxPrice()) > 0) {
                    // Swap nếu người dùng nhập sai thứ tự
                    predicates.add(criteriaBuilder.between(
                            root.get("priceWeekday"), request.getMaxPrice(), request.getMinPrice()));
                }
            }

            // 3. Lọc theo số phòng ngủ
            if (request.getMinBedroom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("bedroomCount"), request.getMinBedroom()));
            }

            // 4. Lọc theo số phòng tắm (MỚI)
            if (request.getMaxBathroom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("bathroomCount"), request.getMaxBathroom()));
            }

            // 5. Lọc theo số khách tối đa
            if (request.getMaxGuests() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("maxGuests"), request.getMaxGuests()));
            }

            // 5.1 Lọc theo số khách tối thiểu (mới)
            if (request.getMinGuests() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("maxGuests"), request.getMinGuests()));
            }

            // 6. Lọc theo trạng thái (Cải tiến cho Soft Delete)
            if (request.getStatusList() != null && !request.getStatusList().isEmpty()) {
                predicates.add(root.get("status").in(request.getStatusList()));
            } else {
                // Mặc định: Chỉ hiện ACTIVE (hoặc khác DELETED), tùy requirement.
                // Ở đây mình set mặc định là ACTIVE để public page chỉ hiện active.
                // Admin muốn xem all thì phải gửi statusList
                predicates.add(criteriaBuilder.equal(root.get("status"), "ACTIVE"));
            }

            // 7. Lọc theo Khu vực (cũ - enum)
            if (request.getLocation() != null) {
                predicates.add(criteriaBuilder.equal(root.get("location"), request.getLocation()));
            }

            // 7.1 Lọc theo Location ID (mới - entity)
            if (request.getLocationId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("locationEntity").get("id"), request.getLocationId()));
            }

            // 7.2 Lọc theo Property Type ID (mới)
            if (request.getPropertyTypeId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("propertyType").get("id"), request.getPropertyTypeId()));
            }

            // 8. Lọc theo Feature (MỚI - Carousel)
            if (request.getIsFeatured() != null) {
                predicates.add(criteriaBuilder.equal(root.get("isFeatured"), request.getIsFeatured()));
            }

            // 9. Lọc theo Tiện ích (CỰC KỲ CẢI THIỆN!)
            if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
                String matchMode = request.getAmenityMatchMode();

                if ("ALL".equalsIgnoreCase(matchMode)) {
                    // Logic: Villa phải có ĐỦ TẤT CẢ các tiện ích
                    // Sử dụng Subquery với COUNT
                    Subquery<Long> subquery = query.subquery(Long.class);
                    var subRoot = subquery.from(Property.class);
                    Join<Property, Amenity> subJoin = subRoot.join("amenities");

                    subquery.select(criteriaBuilder.count(subJoin.get("id")))
                            .where(
                                    criteriaBuilder.equal(subRoot.get("id"), root.get("id")),
                                    subJoin.get("id").in(request.getAmenityIds()));

                    // Số lượng amenity match phải bằng số lượng amenity yêu cầu
                    predicates.add(criteriaBuilder.equal(
                            subquery, (long) request.getAmenityIds().size()));

                } else {
                    // Logic mặc định: Villa có ít nhất 1 trong các tiện ích (ANY)
                    Join<Property, Amenity> amenitiesJoin = root.join("amenities", JoinType.INNER);
                    predicates.add(amenitiesJoin.get("id").in(request.getAmenityIds()));
                    query.distinct(true); // Loại bỏ duplicate
                }
            }

            // 10. Lọc theo Labels (Sát biển, View biển, etc.)
            if (request.getLabelIds() != null && !request.getLabelIds().isEmpty()) {
                String matchMode = request.getLabelMatchMode();

                if ("ALL".equalsIgnoreCase(matchMode)) {
                    // Logic: Villa phải có ĐỦ TẤT CẢ các labels
                    Subquery<Long> subquery = query.subquery(Long.class);
                    var subRoot = subquery.from(Property.class);
                    Join<Property, com.taivillavungtau.backend.entity.Label> subJoin = subRoot.join("labels");

                    subquery.select(criteriaBuilder.count(subJoin.get("id")))
                            .where(
                                    criteriaBuilder.equal(subRoot.get("id"), root.get("id")),
                                    subJoin.get("id").in(request.getLabelIds()));

                    predicates.add(criteriaBuilder.equal(
                            subquery, (long) request.getLabelIds().size()));

                } else {
                    // Logic mặc định: Villa có ít nhất 1 trong các labels (ANY)
                    Join<Property, com.taivillavungtau.backend.entity.Label> labelsJoin = root.join("labels",
                            JoinType.INNER);
                    predicates.add(labelsJoin.get("id").in(request.getLabelIds()));
                    query.distinct(true);
                }
            }

            // 10. Default Sorting (Natural Numeric Sort for Code: MS90 > MS1)
            String sort = request.getSort();
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                if (sort == null || sort.trim().isEmpty() || "newest".equalsIgnoreCase(sort)
                        || "code_desc".equalsIgnoreCase(sort)) {
                    query.orderBy(
                            criteriaBuilder.desc(criteriaBuilder.length(root.get("code"))),
                            criteriaBuilder.desc(root.get("code")));
                } else if ("code_asc".equalsIgnoreCase(sort)) {
                    query.orderBy(
                            criteriaBuilder.asc(criteriaBuilder.length(root.get("code"))),
                            criteriaBuilder.asc(root.get("code")));
                } else if ("updatedAt_desc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.desc(root.get("updatedAt")));
                } else if ("updatedAt_asc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.asc(root.get("updatedAt")));
                } else if ("name_asc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.asc(root.get("name")));
                } else if ("name_desc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.desc(root.get("name")));
                } else if ("price_asc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.asc(root.get("priceWeekday")));
                } else if ("price_desc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.desc(root.get("priceWeekday")));
                } else if ("status_asc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.asc(root.get("status")));
                } else if ("status_desc".equalsIgnoreCase(sort)) {
                    query.orderBy(criteriaBuilder.desc(root.get("status")));
                }
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
