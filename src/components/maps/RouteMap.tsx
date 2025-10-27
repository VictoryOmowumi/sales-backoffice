import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Play, MapPin as MapPinIcon } from 'lucide-react';
import type { SalesRoute, RouteVisit } from '@/domain/routes';

// Fix for default markers in react-leaflet
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconUrl: MapPinIcon.toString(),
});

interface RouteMapProps {
  routes: SalesRoute[];
  visits: RouteVisit[];
  role: string;
  onStartVisit?: (customerId: string, routeId: string) => void;
}

// Mock customer data with coordinates - updated to match new route structure
const mockCustomers = [
  // IKEJA REGION - Multiple routes per territory
  { id: 'cust-001', name: 'Shoprite Ikeja City Mall', address: 'Ikeja City Mall', lga: 'Ikeja', coordinates: [6.5244, 3.3792] },
  { id: 'cust-002', name: 'Spar Victoria Island', address: 'Victoria Island', lga: 'Eti-Osa', coordinates: [6.4281, 3.4219] },
  { id: 'cust-003', name: 'Game Store Ikeja', address: 'Ikeja Shopping Center', lga: 'Ikeja', coordinates: [6.6018, 3.3515] },
  { id: 'cust-004', name: 'Shoprite Ikeja', address: 'Ikeja Plaza', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  { id: 'cust-005', name: 'Ikeja General Trade Store A', address: 'Ikeja General Trade', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  { id: 'cust-006', name: 'Ikeja General Trade Store B', address: 'Ikeja General Trade', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  { id: 'cust-007', name: 'Ikeja General Trade Store C', address: 'Ikeja General Trade', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  { id: 'cust-008', name: 'Ikeja Hotel Premium', address: 'Ikeja Hotel Complex', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  { id: 'cust-009', name: 'Ikeja Restaurant Elite', address: 'Ikeja Restaurant', lga: 'Ikeja', coordinates: [6.5018, 3.3515] },
  
  // SURULERE TERRITORY - Multiple routes
  { id: 'cust-010', name: 'Surulere Modern Trade Store A', address: 'Surulere Modern Trade', lga: 'Surulere', coordinates: [6.5018, 3.3515] },
  { id: 'cust-011', name: 'Surulere Modern Trade Store B', address: 'Surulere Modern Trade', lga: 'Surulere', coordinates: [6.5018, 3.3515] },
  { id: 'cust-012', name: 'Surulere General Trade Store A', address: 'Surulere General Trade', lga: 'Surulere', coordinates: [6.5018, 3.3515] },
  { id: 'cust-013', name: 'Surulere General Trade Store B', address: 'Surulere General Trade', lga: 'Surulere', coordinates: [6.5018, 3.3515] },
  { id: 'cust-014', name: 'Surulere General Trade Store C', address: 'Surulere General Trade', lga: 'Surulere', coordinates: [6.5018, 3.3515] },
  
  // KANO REGION - Kano Municipal Territory (Multiple routes)
  { id: 'cust-015', name: 'Kano Municipal HORECA Hotel A', address: 'Kano Municipal Hotel', lga: 'Kano Municipal', coordinates: [12.0022, 8.5920] },
  { id: 'cust-016', name: 'Kano Municipal HORECA Restaurant A', address: 'Kano Municipal Restaurant', lga: 'Kano Municipal', coordinates: [12.0022, 8.5920] },
  { id: 'cust-017', name: 'Kano Municipal HORECA Catering A', address: 'Kano Municipal Catering', lga: 'Kano Municipal', coordinates: [12.0022, 8.5920] },
  { id: 'cust-018', name: 'Kano Municipal General Trade A', address: 'Kano Municipal General Trade', lga: 'Kano Municipal', coordinates: [12.0022, 8.5920] },
  { id: 'cust-019', name: 'Kano Municipal General Trade B', address: 'Kano Municipal General Trade', lga: 'Kano Municipal', coordinates: [12.0022, 8.5920] },
  
  // ABUJA REGION - Abuja Municipal Territory (Multiple routes)
  { id: 'cust-020', name: 'Abuja Municipal E-Commerce Hub A', address: 'Abuja E-Commerce Hub', lga: 'Abuja Municipal', coordinates: [9.0765, 7.3986] },
  { id: 'cust-021', name: 'Abuja Municipal E-Commerce Hub B', address: 'Abuja E-Commerce Hub', lga: 'Abuja Municipal', coordinates: [9.0765, 7.3986] },
  { id: 'cust-022', name: 'Abuja Municipal Modern Trade A', address: 'Abuja Modern Trade', lga: 'Abuja Municipal', coordinates: [9.0765, 7.3986] },
  { id: 'cust-023', name: 'Abuja Municipal Modern Trade B', address: 'Abuja Modern Trade', lga: 'Abuja Municipal', coordinates: [9.0765, 7.3986] },
  { id: 'cust-024', name: 'Abuja Municipal Modern Trade C', address: 'Abuja Modern Trade', lga: 'Abuja Municipal', coordinates: [9.0765, 7.3986] },
  
  // KADUNA REGION - Kaduna North Territory (Multiple routes)
  { id: 'cust-025', name: 'Kaduna North General Trade A', address: 'Kaduna North General Trade', lga: 'Kaduna North', coordinates: [10.5200, 7.4382] },
  { id: 'cust-026', name: 'Kaduna North General Trade B', address: 'Kaduna North General Trade', lga: 'Kaduna North', coordinates: [10.5200, 7.4382] },
  { id: 'cust-027', name: 'Kaduna North General Trade C', address: 'Kaduna North General Trade', lga: 'Kaduna North', coordinates: [10.5200, 7.4382] },
  { id: 'cust-028', name: 'Kaduna North HORECA Hotel A', address: 'Kaduna North Hotel', lga: 'Kaduna North', coordinates: [10.5200, 7.4382] },
  { id: 'cust-029', name: 'Kaduna North HORECA Restaurant A', address: 'Kaduna North Restaurant', lga: 'Kaduna North', coordinates: [10.5200, 7.4382] },
  
  // IBADAN REGION - Ibadan North Territory (Multiple routes)
  { id: 'cust-030', name: 'Ibadan North Modern Trade A', address: 'Ibadan North Modern Trade', lga: 'Ibadan North', coordinates: [7.3986, 3.9167] },
  { id: 'cust-031', name: 'Ibadan North Modern Trade B', address: 'Ibadan North Modern Trade', lga: 'Ibadan North', coordinates: [7.3986, 3.9167] },
  { id: 'cust-032', name: 'Ibadan North General Trade A', address: 'Ibadan North General Trade', lga: 'Ibadan North', coordinates: [7.3986, 3.9167] },
  { id: 'cust-033', name: 'Ibadan North General Trade B', address: 'Ibadan North General Trade', lga: 'Ibadan North', coordinates: [7.3986, 3.9167] },
  { id: 'cust-034', name: 'Ibadan North General Trade C', address: 'Ibadan North General Trade', lga: 'Ibadan North', coordinates: [7.3986, 3.9167] },
  
  // ENUGU REGION - Enugu East Territory (Multiple routes)
  { id: 'cust-035', name: 'Enugu East General Trade A', address: 'Enugu East General Trade', lga: 'Enugu East', coordinates: [6.4500, 7.5000] },
  { id: 'cust-036', name: 'Enugu East General Trade B', address: 'Enugu East General Trade', lga: 'Enugu East', coordinates: [6.4500, 7.5000] },
  { id: 'cust-037', name: 'Enugu East General Trade C', address: 'Enugu East General Trade', lga: 'Enugu East', coordinates: [6.4500, 7.5000] },
  { id: 'cust-038', name: 'Enugu East HORECA Hotel A', address: 'Enugu East Hotel', lga: 'Enugu East', coordinates: [6.4500, 7.5000] },
  { id: 'cust-039', name: 'Enugu East HORECA Restaurant A', address: 'Enugu East Restaurant', lga: 'Enugu East', coordinates: [6.4500, 7.5000] },
];

export default function RouteMap({ routes, visits, role, onStartVisit }: RouteMapProps) {
  const handleStartVisit = (customerId: string, routeId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const customer = mockCustomers.find(c => c.id === customerId);
    const route = routes.find(r => r.id === routeId);
    
    if (customer && route) {
      // Create a new visit if it doesn't exist
      const existingVisit = visits.find(v => 
        v.customerId === customerId && 
        v.scheduledDate.startsWith(today)
      );
      
      if (!existingVisit) {
        const newVisit: RouteVisit = {
          id: `visit-${Date.now()}`, // Simple ID generation
          routeId,
          customerId,
          customerName: customer.name,
          repId: route.repId,
          repName: route.repName,
          scheduledDate: today,
          scheduledTime: '09:00',
          status: 'scheduled',
        };
        // In a real app, this would be saved to the backend
        console.log('Created new visit:', newVisit);
      }
      
      if (onStartVisit) {
        onStartVisit(customerId, routeId);
      }
    }
  };

  // Calculate center point for the map
  const allCoordinates = routes.flatMap(route => 
    route.customers
      .map(cid => mockCustomers.find(c => c.id === cid))
      .filter(c => c?.coordinates)
      .map(c => c!.coordinates as [number, number])
  );

  const center: LatLngExpression = allCoordinates.length > 0 
    ? allCoordinates[0] 
    : [6.5244, 3.3792] as [number, number]; // Default to Lagos

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routes.map(route => {
          const customerObjs = route.customers
            .map(cid => mockCustomers.find(c => c.id === cid))
            .filter((c): c is typeof mockCustomers[number] => !!c && !!c.coordinates);
          
          const routeCoordinates = customerObjs.map(c => c.coordinates as [number, number]);
          
          return (
            <div key={route.id}>
              {/* Route Polyline */}
              {routeCoordinates.length > 1 && (
                <Polyline
                  positions={routeCoordinates}
                  color={route.status === 'active' ? '#0367FC' : '#6B7280'}
                  weight={3}
                  opacity={0.7}
                />
              )}
              
              {/* Customer Markers */}
              {customerObjs.map((c) => (
                <Marker 
                  key={`${route.id}-${c.id}`} 
                  position={c.coordinates as [number, number]}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="font-bold text-sm mb-1">{c.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {c.address}, {c.lga}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Route: {route.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        Rep: {route.repName}
                      </div>
                      
                      {role === 'sales' && (
                        <Button
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleStartVisit(c.id, route.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Visit
                        </Button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
