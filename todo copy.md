# Enhanced Project Enhancement Prompt

## CONTEXT
You are working on QASA (Quality Air Sensing Application), a full-stack air quality monitoring platform built with React 19, TypeScript, Vite, Express.js, and PostgreSQL (Neon). The application currently has two distinct user modes:

1. **Resident Mode**: Simplified dashboard for daily air quality monitoring with health-focused features including cigarette equivalence calculations, exercise advisors, and personalized notifications
2. **Professional Mode**: Advanced research tools with data upload capabilities, risk calculators, historical analysis, and dataset management

The current professional dashboard (`src/pages/professional/Dashboard.tsx`) uses a resizable panel layout with:
- Left sidebar navigation (Dashboard, Research Overview, Risk Calculator, Data Upload, Reports)
- Main content area with map integration and tabbed views
- Right sidebar showing location details and monitoring stations
- AI Assistant integration for professional queries

The tech stack includes:
- Frontend: React 19, TypeScript, Tailwind CSS v4, Radix UI components, Recharts
- Backend: Express.js with Drizzle ORM
- APIs: OpenWeather API, WAQI (World Air Quality Index)
- Maps: Leaflet with react-leaflet
- Authentication: Clerk
- Database: PostgreSQL (Neon serverless)

## PERSONA
You are a senior full-stack developer specializing in data visualization, dashboard design, and environmental monitoring applications. You have deep expertise in React ecosystem, real-time data processing, API integration, and creating production-grade UIs that balance information density with usability.

## TASK
Analyze the reference website https://www.aqi.in/ and the two attached screenshots showing:
1. The comprehensive air quality dashboard with multiple data visualization sections
2. The detailed weather page with forecasts and metrics

Then create a comprehensive implementation plan to integrate ALL features visible in these images (excluding blog sections) into QASA's Professional Dashboard. The implementation must:

### Core Requirements:

1. **Dashboard Integration**
   - Implement ALL visible UI sections and data visualizations from the reference images
   - Maintain QASA's existing design system (dark mode, glass morphism, color tokens)
   - Preserve current functionality while adding new features
   - Ensure responsive design across all screen sizes

2. **Feature Parity Analysis**
   - Document every distinct feature/section visible in the reference images
   - Map each feature to equivalent QASA components or identify as new
   - Specify exact data requirements for each feature
   - Define API endpoints needed (existing or new)

3. **Data Source Strategy**
   - Identify which OpenWeather API endpoints can provide required data
   - Determine if additional API integrations are needed
   - Specify database schema updates for caching/historical data
   - Define fallback strategies for missing data

4. **UI/UX Specifications**
   - Detailed layout specifications for each new section
   - Component hierarchy and relationships
   - Interaction patterns and animations
   - Loading states and error handling

5. **Technical Implementation Details**
   - New component file structure with exact paths
   - Required TypeScript interfaces/types
   - Service layer modifications
   - State management approach

## FORMAT

Structure your response as a comprehensive implementation specification document with the following sections:

### 1. EXECUTIVE SUMMARY
Brief overview of changes and estimated scope

### 2. REFERENCE ANALYSIS
Detailed breakdown of every feature in the reference images organized by:
- **Section Name**
- **Current Screenshot Location** (Image 1 or 2, approximate position)
- **Feature Description**
- **Data Requirements**
- **Complexity Rating** (Simple/Medium/Complex)
- **Existing QASA Component** (if applicable) or "NEW"

### 3. ARCHITECTURE DECISIONS
- Component structure strategy
- Data flow patterns
- API integration approach
- State management choices
- Caching strategy

### 4. DETAILED FEATURE SPECIFICATIONS

For each major feature section:

#### Feature: [NAME]
**Location**: Professional Dashboard → [Tab/Section]
**Priority**: High/Medium/Low
**Complexity**: Simple/Medium/Complex

**Visual Description**:
- Layout structure
- Color scheme alignment with QASA
- Typography specifications
- Spacing and sizing

**Data Requirements**:
```typescript
interface [FeatureName]Data {
  // Exact TypeScript interface
}
```

**API Integration**:
- Endpoint(s): [URL and parameters]
- Response mapping
- Update frequency
- Error scenarios

**Component Structure**:
```
src/components/professional/[feature-name]/
  ├── [MainComponent].tsx
  ├── [SubComponent1].tsx
  ├── [SubComponent2].tsx
  └── types.ts
```

**Implementation Notes**:
- Specific Recharts configuration (if applicable)
- Leaflet customization (if applicable)
- Performance considerations
- Accessibility requirements

### 5. NEW SERVICES & UTILITIES
List all new service files needed:
```typescript
// src/services/[serviceName].ts
// Purpose: [description]
// Key functions: [list]
```

### 6. DATABASE UPDATES
```sql
-- New tables or columns needed
-- Migration strategy
```

### 7. COMPONENT INVENTORY

Create a complete inventory table:

| Component Path | Purpose | Dependencies | Status |
|----------------|---------|--------------|--------|
| src/components/... | ... | ... | NEW/UPDATE |

### 8. INTEGRATION PLAN

**Phase 1: Foundation (Week 1)**
- [ ] Data service layer updates
- [ ] New TypeScript interfaces
- [ ] Database migrations
- [ ] API endpoint testing

**Phase 2: Core Features (Week 2-3)**
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [etc.]

**Phase 3: Polish & Optimization (Week 4)**
- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] Testing & bug fixes
- [ ] Documentation

### 9. TESTING STRATEGY
- Unit test coverage plan
- Integration test scenarios
- E2E test cases
- Performance benchmarks

### 10. POTENTIAL CHALLENGES & SOLUTIONS
List foreseeable technical challenges with proposed solutions

### 11. DEPENDENCIES & PREREQUISITES
- New npm packages needed
- Environment variables
- API key requirements
- Browser compatibility considerations

## TONE
- Professional and technical
- Precise and specific (avoid vague terms like "improve" or "enhance")
- Action-oriented with clear deliverables
- Pragmatic, acknowledging constraints and tradeoffs
- Include code snippets and exact file paths where relevant

## DELIVERABLE REQUIREMENTS

Your specification document must be:
1. **Exhaustive**: Every visible element in the reference images must be documented
2. **Actionable**: A developer should be able to start implementing immediately
3. **Traceable**: Each requirement maps back to specific reference image content
4. **Realistic**: Acknowledge technical limitations and propose alternatives where needed
5. **Consistent**: Maintain QASA's existing code patterns and architecture

## SPECIAL INSTRUCTIONS

1. **Conduct web research**: Before creating the specification, thoroughly explore https://www.aqi.in/ to understand:
   - All interactive features not visible in screenshots
   - Data update frequencies
   - API patterns they likely use
   - Performance optimizations
   - Mobile responsiveness strategies

2. **Reference existing QASA code**: Analyze the provided codebase documents to:
   - Understand current component patterns
   - Identify reusable utilities
   - Match existing design tokens
   - Follow established naming conventions

3. **API Deep Dive**: Research OpenWeather API documentation to:
   - Map exact endpoints to required data
   - Understand rate limits and costs
   - Identify data transformations needed
   - Plan for missing data scenarios

4. **Do NOT include**:
   - Blog sections or article content
   - User-generated content features
   - Social media integrations
   - Any marketing/promotional content

5. **DO include**:
   - All data visualization components
   - All weather-related metrics and forecasts
   - All air quality indices and breakdowns
   - All historical charts and trend analysis
   - All location-based features
   - All interactive map features
   - All filtering and search capabilities

## EXPECTED OUTPUT LENGTH
A comprehensive specification document of approximately 3000-5000 words with detailed technical specifications, code examples, and implementation guidance.

---

**Remember**: The goal is to create a specification so detailed that any competent full-stack developer could implement these features with minimal additional clarification needed. Be specific, be thorough, and provide context for every decision.
