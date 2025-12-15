import { LocationMap } from './LocationMap';

/**
 * Example usage of the LocationMap component
 * 
 * This file demonstrates different scenarios for using the LocationMap component
 * in the property detail page.
 */

// Example 1: Full data with map URL
export function LocationMapWithMap() {
  return (
    <LocationMap
      mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9!2d107.08!3d10.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzI4LjgiTiAxMDfCsDA0JzQ4LjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
      address="123 Đường Thùy Vân, Phường Thắng Tam, Vũng Tàu"
      locationName="Bãi Sau"
      distanceToSea="50m"
    />
  );
}

// Example 2: Without map URL (fallback)
export function LocationMapWithoutMap() {
  return (
    <LocationMap
      address="456 Đường Thi Sách, Phường 1, Vũng Tàu"
      locationName="Bãi Trước"
      distanceToSea="100m"
    />
  );
}

// Example 3: Minimal data (only address)
export function LocationMapMinimal() {
  return (
    <LocationMap
      address="789 Đường Hoàng Hoa Thám, Vũng Tàu"
    />
  );
}

// Example 4: With map but no distance to sea
export function LocationMapNoDistance() {
  return (
    <LocationMap
      mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9!2d107.08!3d10.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzI4LjgiTiAxMDfCsDA0JzQ4LjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
      address="321 Đường Phan Chu Trinh, Vũng Tàu"
      locationName="Trung tâm thành phố"
    />
  );
}

// Example 5: Real property data structure
export function LocationMapFromProperty() {
  // Simulating data from API
  const property = {
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9!2d107.08!3d10.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzI4LjgiTiAxMDfCsDA0JzQ4LjAiRQ!5e0!3m2!1sen!2s!4v1234567890",
    address: "Villa Biển Xanh, 88 Đường Thùy Vân, Vũng Tàu",
    locationName: "Bãi Sau - Khu vực yên tĩnh",
    distanceToSea: "30m đi bộ"
  };

  return (
    <LocationMap
      mapUrl={property.mapUrl}
      address={property.address}
      locationName={property.locationName}
      distanceToSea={property.distanceToSea}
    />
  );
}

// Example 6: In a full page layout
export function LocationMapInLayout() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Property Details</h1>
      
      {/* Other property sections would go here */}
      
      <LocationMap
        mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9!2d107.08!3d10.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzI4LjgiTiAxMDfCsDA0JzQ4LjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
        address="Villa Paradise, 123 Đường Thùy Vân, Vũng Tàu"
        locationName="Bãi Sau"
        distanceToSea="50m"
      />
    </div>
  );
}
