import { BookingWidget } from './BookingWidget';

export default function BookingWidgetExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">BookingWidget Component Examples</h1>
          <p className="text-gray-600">
            Enhanced sticky sidebar for property detail pages with pricing and booking actions
          </p>
        </div>

        {/* Example 1: Full Widget with All Props */}
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Full Widget (All Props)</h2>
          <p className="text-gray-600 mb-4">
            Complete widget with all optional props: price note, distance to sea, and Facebook link
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={2500000}
                weekendPrice={3000000}
                priceNote="Giá có thể thay đổi vào dịp lễ Tết và các ngày cao điểm"
                distanceToSea="100m"
                facebookLink="https://facebook.com/villa-ms208"
                propertyCode="MS208"
                standardGuests={15}
                bedroomCount={4}
              />
            </div>
          </div>
        </section>

        {/* Example 2: Minimal Widget */}
        <section>
          <h2 className="text-2xl font-bold mb-4">2. Minimal Widget (Required Props Only)</h2>
          <p className="text-gray-600 mb-4">
            Widget with only required props - no price note, distance, or Facebook link
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={1800000}
                propertyCode="MS105"
                standardGuests={10}
                bedroomCount={3}
              />
            </div>
          </div>
        </section>

        {/* Example 3: With Price Note Only */}
        <section>
          <h2 className="text-2xl font-bold mb-4">3. With Price Note</h2>
          <p className="text-gray-600 mb-4">
            Widget with price note alert but no distance or Facebook link
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={3200000}
                weekendPrice={3800000}
                priceNote="Giá đã bao gồm phí dọn dẹp và tiện ích"
                propertyCode="MS301"
                standardGuests={20}
                bedroomCount={6}
              />
            </div>
          </div>
        </section>

        {/* Example 4: With Distance to Sea */}
        <section>
          <h2 className="text-2xl font-bold mb-4">4. With Distance to Sea</h2>
          <p className="text-gray-600 mb-4">
            Widget showing distance to sea with Waves icon
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={2200000}
                weekendPrice={2700000}
                distanceToSea="50m"
                propertyCode="MS150"
                standardGuests={12}
                bedroomCount={4}
              />
            </div>
          </div>
        </section>

        {/* Example 5: With Facebook Link */}
        <section>
          <h2 className="text-2xl font-bold mb-4">5. With Facebook Link</h2>
          <p className="text-gray-600 mb-4">
            Widget with secondary Facebook button
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={2800000}
                weekendPrice={3300000}
                facebookLink="https://facebook.com/villa-beachfront"
                propertyCode="MS220"
                standardGuests={18}
                bedroomCount={5}
              />
            </div>
          </div>
        </section>

        {/* Example 6: High-End Villa */}
        <section>
          <h2 className="text-2xl font-bold mb-4">6. High-End Villa</h2>
          <p className="text-gray-600 mb-4">
            Luxury villa with higher pricing and all features
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={5000000}
                weekendPrice={6000000}
                priceNote="Villa cao cấp với view biển 180 độ, bao gồm đầu bếp riêng"
                distanceToSea="Mặt biển"
                facebookLink="https://facebook.com/luxury-villa-vungtau"
                propertyCode="MS999"
                standardGuests={25}
                bedroomCount={8}
              />
            </div>
          </div>
        </section>

        {/* Example 7: Budget Villa */}
        <section>
          <h2 className="text-2xl font-bold mb-4">7. Budget Villa</h2>
          <p className="text-gray-600 mb-4">
            Affordable villa with basic features
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <BookingWidget
                weekdayPrice={1200000}
                propertyCode="MS050"
                standardGuests={8}
                bedroomCount={2}
              />
            </div>
          </div>
        </section>

        {/* Example 8: In Context (Simulated Page Layout) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">8. In Context (Simulated Layout)</h2>
          <p className="text-gray-600 mb-4">
            Widget displayed in a typical property detail page layout
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Property Images</p>
                  </div>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Property Description</p>
                  </div>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Amenities</p>
                  </div>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Location Map</p>
                  </div>
                </div>
              </div>

              {/* Sidebar with BookingWidget */}
              <aside className="lg:w-96 shrink-0">
                <BookingWidget
                  weekdayPrice={2500000}
                  weekendPrice={3000000}
                  priceNote="Giá có thể thay đổi vào dịp lễ Tết"
                  distanceToSea="100m"
                  facebookLink="https://facebook.com/villa-ms208"
                  propertyCode="MS208"
                  standardGuests={15}
                  bedroomCount={4}
                />
              </aside>
            </div>
          </div>
        </section>

        {/* Sticky Behavior Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">9. Sticky Behavior Demo</h2>
          <p className="text-gray-600 mb-4">
            Scroll down to see the widget stick to the top (requires scrolling)
          </p>
          <div className="bg-white p-8 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Tall content to demonstrate sticky */}
              <div className="flex-1 space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Content Section {i}</p>
                  </div>
                ))}
              </div>

              {/* Sticky Widget */}
              <aside className="lg:w-96 shrink-0">
                <BookingWidget
                  weekdayPrice={2500000}
                  weekendPrice={3000000}
                  distanceToSea="100m"
                  propertyCode="MS208"
                  standardGuests={15}
                  bedroomCount={4}
                />
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
