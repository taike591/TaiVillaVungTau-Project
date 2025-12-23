package com.taivillavungtau.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.taivillavungtau.backend.enums.LocationType;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // MS44

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String address;
    private String area;

    @Column(name = "map_url", columnDefinition = "TEXT")
    private String mapUrl;

    @Column(name = "price_weekday")
    private BigDecimal priceWeekday;

    @Column(name = "price_weekend")
    private BigDecimal priceWeekend;

    @Column(name = "standard_guests")
    private Integer standardGuests;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "bedroom_count")
    private Integer bedroomCount;

    @Column(name = "bathroom_count")
    private Integer bathroomCount;

    @Column(name = "facebook_link")
    private String facebookLink;

    @Column(length = 20)
    private String status; // ACTIVE, HIDDEN

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Quan hệ 1-N với hình ảnh (Batch loading to fix N+1)
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @org.hibernate.annotations.BatchSize(size = 50)
    private Set<PropertyImage> images = new HashSet<>();

    // Quan hệ N-N với tiện ích (Batch loading to fix N+1)
    @ManyToMany
    @JoinTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"), inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    @Builder.Default
    @ToString.Exclude
    @org.hibernate.annotations.BatchSize(size = 50)
    private Set<Amenity> amenities = new HashSet<>();

    // Quan hệ N-N với labels (VD: "Sát biển", "View biển")
    @ManyToMany
    @JoinTable(name = "property_labels", joinColumns = @JoinColumn(name = "property_id"), inverseJoinColumns = @JoinColumn(name = "label_id"))
    @Builder.Default
    @ToString.Exclude
    @org.hibernate.annotations.BatchSize(size = 50)
    private Set<Label> labels = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "location")
    private LocationType location; // Keep temporarily for migration

    // New: Dynamic location reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location locationEntity;

    // New: Property type (Villa, Homestay, etc.)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_type_id")
    private PropertyType propertyType;

    @Column(name = "bed_count")
    private Integer bedCount;

    @Column(name = "bed_config")
    private String bedConfig;

    @Column(name = "distance_to_sea")
    private String distanceToSea;

    @Column(name = "price_note")
    private String priceNote;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    // Virtual column for sorting by image count
    @org.hibernate.annotations.Formula("(SELECT count(*) FROM property_images pi WHERE pi.property_id = id)")
    private Integer imageCount;

    // --- SEO META DATA ---
    @Column(name = "meta_title")
    private String metaTitle; // Tiêu đề hiển thị trên Google/Zalo

    @Column(name = "meta_description", length = 500)
    private String metaDescription; // Mô tả ngắn hiển thị trên Google/Zalo

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}