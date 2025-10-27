# Route Map Component

This component provides a full interactive map representation of routes and customer locations using Leaflet.

## Current Implementation

The current implementation includes:
- **Interactive Map**: Full Leaflet integration with OpenStreetMap tiles
- **Route Visualization**: Polylines showing route paths between customers
- **Customer Markers**: Clickable markers for each customer location
- **Route Information**: Popups with customer details and route information
- **Visit Management**: Start visits directly from map markers
- **Territory Coverage**: Visual representation of route coverage

## Dependencies

The following dependencies are required and already installed:

```bash
npm install react-leaflet leaflet @types/leaflet
```

## Features

- **Interactive Map**: Full Leaflet map with zoom, pan, and click interactions
- **Route Visualization**: Polylines connecting customers in each route
- **Customer Markers**: Clickable markers with detailed popups
- **Territory Coverage**: Visual representation of route coverage across territories
- **Visit Management**: Start visits directly from map markers
- **Role-Based Access**: Different actions for RSM vs Sales Rep
- **Real-time Updates**: Dynamic route status and customer information

## Usage

```tsx
import RouteMap from '@/components/maps/RouteMap';

<RouteMap 
  routes={routes} 
  role={userRole}
  onStartVisit={(customerId, routeId) => {
    // Handle visit start
  }}
/>
```

## Future Enhancements

- Real-time GPS tracking
- Route optimization algorithms
- Traffic-aware routing
- Mobile-responsive design
- Offline map support
