

# Urban Heat Mapper — MVP Plan

## Overview
An analytical dashboard for Indian cities that helps government bodies and organizations visualize the impact of strategic tree plantation on urban heat and air quality. Uses mock data initially with a clear path to integrate live APIs later.

---

## Page 1: Dashboard Home
- **City selector** dropdown for major Indian cities (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, etc.)
- **Summary cards** showing current Temperature, AQI, Tree Cover %, and a composite Urban Heat Index
- **Charts panel** with temperature trend (line chart) and AQI breakdown (bar chart) using mock historical data
- Quick-access links to the Map and Tree Planner sections

## Page 2: Interactive Heat Map
- **Google Maps** integration centered on the selected city
- **Heat overlay** showing temperature zones (color-coded red → orange → yellow → green)
- **AQI overlay** toggle to visualize pollution hotspots
- **Tree canopy layer** showing existing green cover density
- Users can toggle between overlays and zoom into neighborhoods

## Page 3: Virtual Tree Planner
- Same map view but in **planning mode**
- Users **click on the map to place virtual trees** from a selection panel
- **Tree selection sidebar** with Indian native species (Neem, Peepal, Banyan, Ashoka, Gulmohar, Arjuna, etc.) showing:
  - Cooling capacity (°C reduction per tree at maturity)
  - Pollution absorption rating
  - Anticipated Performance Index (API) score
  - Water requirement and growth rate
- After placing trees, a **simulation panel** shows:
  - Estimated temperature reduction in the area
  - Estimated AQI improvement
  - Combined API score for the plantation plan
- Users can save/reset their planting scenarios

## Page 4: Tree Recommendations
- Based on selected city/region, auto-suggests the **best native trees** ranked by:
  1. Highest combined temperature + AQI reduction
  2. Best API score for local pollution profile
  3. Climate suitability for the specific Indian region (tropical, arid, temperate hills, etc.)
- **Comparison table** letting users compare up to 4 tree species side by side
- Region-aware filtering — only shows trees native to the selected geography (e.g., tropical species for Chennai, drought-resistant for Rajasthan)

## Page 5: Reports & Insights
- Summary report of a virtual planting scenario showing before/after projections
- Exportable as a shareable view (printable format)
- Key metrics: area covered, trees planted, projected temperature drop, AQI improvement, total API score

---

## Design & Layout
- **Dashboard/analytical style** with a sidebar navigation
- Dark-accented professional color palette with green highlights for environmental data
- Responsive layout optimized for desktop (primary use case for organizations)
- Charts powered by Recharts (already installed)

## Data Approach (MVP)
- All weather, AQI, and tree data will be **mock/hardcoded** with realistic values for Indian cities
- Tree species database with ~15-20 native Indian species including API scores, cooling/pollution metrics
- Data structured so it can be swapped for real API calls (OpenWeatherMap, WAQI) in a future iteration

## Future Enhancements (not in MVP)
- Live API integration for real-time weather and AQI
- Google Earth Engine integration for actual canopy data
- User accounts and saved scenarios (requires backend)
- Support for additional countries (Canada, USA)

