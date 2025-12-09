# QASA Professional Dashboard Enhancement - Implementation Guide

## CONTEXT
Following the comprehensive specification document that analyzed https://www.aqi.in/ and mapped all features to QASA's Professional Dashboard, this document provides the complete implementation roadmap. The previous specification identified all required features, data sources, and component structures. This guide details the exact steps, code patterns, file modifications, and implementation sequence needed to bring those specifications to life.

QASA's current architecture uses:
- **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS v4
- **State Management**: React hooks (useState, useEffect) with custom hooks pattern
- **Data Fetching**: Axios-based services with real-time polling
- **Styling**: Tailwind utility classes + CSS variables for theming
- **Components**: Radix UI primitives + custom shadcn/ui components
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (Neon)
- **APIs**: OpenWeather API (primary), WAQI API (supplementary)

The implementation must maintain backward compatibility with existing Resident Dashboard while significantly expanding Professional Dashboard capabilities.

## PERSONA
You are a technical architect and implementation lead responsible for translating the feature specification into executable work packages. You understand both the big picture (system architecture, data flow, scalability) and the granular details (file structures, function signatures, error handling patterns). You provide step-by-step guidance that accounts for dependencies, testing requirements, and incremental deployment strategies.

## TASK
Create a complete, actionable implementation guide that transforms the feature specification into reality. This guide must:

### Core Objectives:

1. **Dependency Resolution**
   - Identify all new npm packages required
   - Specify exact version numbers and compatibility
   - Document installation commands and configuration
   - Address potential peer dependency conflicts

2. **File Structure Blueprint**
   - Complete directory tree for all new files
   - Modifications needed for existing files (line-by-line where critical)
   - Import/export patterns across the codebase
   - Asset organization (icons, images, constants)

3. **API Integration Playbook**
   - Detailed OpenWeather API endpoint configurations
   - Request/response transformation patterns
   - Caching strategy implementation
   - Rate limiting and quota management
   - Error handling and retry logic

4. **Database Schema Evolution**
   - Drizzle ORM schema additions with exact TypeScript definitions
   - Migration scripts in correct sequence
   - Index optimization strategies
   - Data seeding approaches for development/testing

5. **Component Implementation Order**
   - Dependency graph showing build sequence
   - Foundation-first approach (services → types → UI)
   - Parallel development opportunities
   - Integration checkpoints

6. **Code Patterns & Standards**
   - Exact TypeScript patterns to follow
   - Error boundary implementations
   - Loading state management
   - Responsive design breakpoints
   - Accessibility requirements

## FORMAT

Structure your response as a multi-section implementation playbook:

### 1. PRE-IMPLEMENTATION CHECKLIST

**Environment Setup**:
```bash
# Exact commands to run
```

**Required Access/Credentials**:
- [ ] OpenWeather API key with required tier
- [ ] Additional API keys (if needed)
- [ ] Database access permissions
- [ ] Environment variable configuration

**Development Tools**:
- [ ] VS Code extensions recommended
- [ ] Browser dev tools setup
- [ ] Testing framework configuration
- [ ] Debugging tools

### 2. DEPENDENCY INSTALLATION & CONFIGURATION

#### 2.1 New NPM Packages

For each package:

**Package**: `[package-name]@[version]`
**Purpose**: [Specific use case]
**Installation**:
```bash
npm install [package-name]@[version]
```
**Configuration** (if applicable):
```typescript
// Exact configuration code with file path
```
**Alternatives Considered**: [Why this choice was made]

#### 2.2 Environment Variables

```bash
# .env additions (with example values)
VITE_NEW_VARIABLE_NAME=example_value
```

**Documentation**:
- Variable purpose
- Where to obtain value
- Security considerations
- Fallback behavior if missing

### 3. FILE STRUCTURE IMPLEMENTATION

#### 3.1 Complete Directory Tree

```
src/
├── components/
│   ├── professional/
│   │   ├── [new-feature-1]/
│   │   │   ├── index.tsx              # [purpose]
│   │   │   ├── [SubComponent].tsx     # [purpose]
│   │   │   ├── types.ts               # [purpose]
│   │   │   └── utils.ts               # [purpose]
│   │   ├── [new-feature-2]/
│   │   └── ...
│   ├── dashboard/
│   │   └── [modifications]/
│   └── ui/
│       └── [new-primitives]/
├── services/
│   ├── [new-service-1].ts
│   ├── [new-service-2].ts
│   └── [modified-existing].ts
├── hooks/
│   ├── [new-hook-1].ts
│   └── [new-hook-2].ts
├── types/
│   ├── [new-types-1].ts
│   └── [new-types-2].ts
├── lib/
│   └── [new-utilities]/
└── constants/
    └── [new-constants].ts
```

#### 3.2 File Creation Sequence

**Order matters for dependencies**:

1. **Phase 1: Foundation (Day 1-2)**
   - [ ] `src/types/[feature].ts` - TypeScript interfaces
   - [ ] `src/constants/[feature].ts` - Constants and enums
   - [ ] `src/lib/[utilities].ts` - Utility functions
   - [ ] `src/services/[api-service].ts` - API integration

2. **Phase 2: Data Layer (Day 3-4)**
   - [ ] `src/hooks/[data-hook].ts` - Custom hooks
   - [ ] Database schema updates
   - [ ] Migration scripts

3. **Phase 3: UI Components (Day 5-10)**
   - [ ] Base components (atoms)
   - [ ] Composite components (molecules)
   - [ ] Feature components (organisms)
   - [ ] Page integration

4. **Phase 4: Integration (Day 11-12)**
   - [ ] Dashboard integration
   - [ ] Navigation updates
   - [ ] State management
   - [ ] Error boundaries

### 4. DATABASE IMPLEMENTATION

#### 4.1 Schema Updates

**File**: `src/db/schema.ts`

```typescript
// Add to existing schema.ts

// New table for [feature]
export const [tableName] = pgTable("[table_name]", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  // ... complete field definitions with comments
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relationships (if applicable)
export const [relationName] = relations([tableName], ({ one, many }) => ({
  // ... relationship definitions
}));

// TypeScript inferred types
export type [TypeName] = typeof [tableName].$inferSelect;
export type New[TypeName] = typeof [tableName].$inferInsert;
```

#### 4.2 Migration Strategy

**Create migration file**: `migrations/[timestamp]_add_[feature].sql`

```sql
-- Up Migration
CREATE TABLE IF NOT EXISTS [table_name] (
  -- exact SQL with constraints
);

CREATE INDEX idx_[name] ON [table_name]([column]);

-- Down Migration (for rollback)
DROP TABLE IF EXISTS [table_name];
```

**Run migration**:
```bash
npm run db:push
# or for production
npm run db:migrate
```

#### 4.3 Seed Data Script

**File**: `src/db/seed/[feature]-seed.ts`

```typescript
// Complete seed script with example data
import { db } from '../index';
import { [tableName] } from '../schema';

export async function seed[Feature]() {
  await db.insert([tableName]).values([
    // ... seed data
  ]);
}
```

### 5. API SERVICE IMPLEMENTATION

#### 5.1 Service Layer Pattern

**File**: `src/services/[feature]Service.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import type { [RequestType], [ResponseType] } from '@/types/[feature]';

/**
 * [Service Purpose]
 * 
 * API Documentation: [link]
 * Rate Limit: [details]
 * Caching: [strategy]
 */
class [Feature]Service {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor() {
    this.api = axios.create({
      baseURL: '[base-url]',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.cache = new Map();

    // Request interceptor for auth/logging
    this.api.interceptors.request.use(
      (config) => {
        // Add API key, logging, etc.
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * [Method description]
   * @param {[type]} param - [description]
   * @returns {Promise<[type]>} [description]
   * @throws {Error} [error scenarios]
   */
  async [methodName](param: [Type]): Promise<[ReturnType]> {
    const cacheKey = `[key-pattern]`;
    
    // Check cache
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.get('[endpoint]', {
        params: {
          // ... parameters
        },
      });

      const transformed = this.transform[Response](response.data);
      this.setCache(cacheKey, transformed);
      
      return transformed;
    } catch (error) {
      console.error(`[Feature]Service.[methodName] failed:`, error);
      throw this.handleError(error);
    }
  }

  private getCached(key: string): [Type] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private transform[Response](raw: any): [Type] {
    // Transformation logic with type safety
    return {
      // ... mapped fields
    };
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      // Specific error handling based on status codes
      switch (error.response?.status) {
        case 401:
          return new Error('API authentication failed');
        case 429:
          return new Error('Rate limit exceeded');
        case 404:
          return new Error('Resource not found');
        default:
          return new Error(error.message);
      }
    }
    return error;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const [feature]Service = new [Feature]Service();
```

#### 5.2 API Endpoint Mapping

For each feature from the specification:

**Feature**: [Feature Name]
**OpenWeather Endpoint**: `[endpoint-url]`
**Request Parameters**:
```typescript
interface [Feature]Params {
  lat: number;
  lon: number;
  // ... other params with descriptions
}
```

**Response Structure**:
```typescript
// Raw API response
interface [Feature]RawResponse {
  // ... exact API response structure
}

// Transformed for QASA
interface [Feature]Data {
  // ... application data structure
}
```

**Transformation Example**:
```typescript
function transform[Feature](raw: [Feature]RawResponse): [Feature]Data {
  return {
    // ... explicit mapping with comments
  };
}
```

**Error Scenarios**:
- Network timeout: [handling approach]
- Invalid API key: [handling approach]
- Rate limit: [handling approach]
- Data unavailable: [fallback strategy]

### 6. CUSTOM HOOKS IMPLEMENTATION

#### 6.1 Data Fetching Hook Pattern

**File**: `src/hooks/use[Feature].ts`

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { [feature]Service } from '@/services/[feature]Service';
import type { [DataType], [ErrorType] } from '@/types/[feature]';

interface Use[Feature]Options {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: [DataType]) => void;
  onError?: (error: Error) => void;
}

interface Use[Feature]Return {
  data: [DataType] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook for fetching and managing [feature] data
 * 
 * @param {[ParamType]} param - [description]
 * @param {Use[Feature]Options} options - Configuration options
 * @returns {Use[Feature]Return} [description]
 * 
 * @example
 * const { data, isLoading, refetch } = use[Feature](location, {
 *   refetchInterval: 300000, // 5 minutes
 *   onSuccess: (data) => console.log('Data loaded', data),
 * });
 */
export function use[Feature](
  param: [ParamType],
  options: Use[Feature]Options = {}
): Use[Feature]Return {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<[DataType] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup
  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await [feature]Service.[method](param);
      
      if (!isMountedRef.current) return;

      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error('Unknown error');
      setIsError(true);
      setError(error);
      onError?.(error);
      console.error('[Feature] fetch error:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [param, enabled, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling setup
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refetchInterval, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated,
  };
}
```

#### 6.2 Hook Integration Pattern

**In component**:
```typescript
// src/components/professional/[Feature]/[Component].tsx

import { use[Feature] } from '@/hooks/use[Feature]';

export function [Component]() {
  const { data, isLoading, error, refetch } = use[Feature](params, {
    refetchInterval: 300000, // 5 min
    onError: (err) => toast.error(err.message),
  });

  if (isLoading && !data) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    // ... component JSX
  );
}
```

### 7. COMPONENT IMPLEMENTATION GUIDE

#### 7.1 Component Architecture Pattern

**File Structure for Complex Feature**:
```
src/components/professional/[feature]/
├── index.tsx                 # Main container component
├── [Feature]Header.tsx       # Header with controls
├── [Feature]Content.tsx      # Main content area
├── [Feature]Sidebar.tsx      # Sidebar (if applicable)
├── [Feature]Card.tsx         # Reusable card component
├── [Feature]Chart.tsx        # Chart visualization
├── [Feature]Table.tsx        # Data table
├── [Feature]Filters.tsx      # Filter controls
├── types.ts                  # Component-specific types
├── constants.ts              # Component constants
├── utils.ts                  # Helper functions
└── styles.module.css         # Component-specific styles (if needed)
```

#### 7.2 Component Template

**File**: `src/components/professional/[feature]/index.tsx`

```typescript
import { useState, useMemo, useCallback } from 'react';
import { use[Feature] } from '@/hooks/use[Feature]';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { [Icon1], [Icon2] } from 'lucide-react';
import type { [FeatureProps], [FeatureData] } from './types';

// Sub-components
import { [Feature]Header } from './[Feature]Header';
import { [Feature]Content } from './[Feature]Content';
import { [Feature]Sidebar } from './[Feature]Sidebar';

/**
 * [Feature] Component
 * 
 * [Detailed description of what this component does]
 * 
 * @param {[FeatureProps]} props - Component props
 * @returns {JSX.Element}
 */
export function [Feature]({ 
  className,
  // ... other props 
}: [FeatureProps]): JSX.Element {
  // State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filters, setFilters] = useState<FilterType>({});

  // Data fetching
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = use[Feature](params, {
    refetchInterval: 300000,
  });

  // Computed values
  const processedData = useMemo(() => {
    if (!data) return null;
    // ... data processing
    return processedResult;
  }, [data, filters]);

  // Event handlers
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterType) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Loading state
  if (isLoading && !data) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <[Icon1] className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Failed to load data
              </h3>
              <p className="text-sm text-muted-foreground">
                {error.message}
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!processedData) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <[Icon2] className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main render
  return (
    <div className={cn("space-y-6", className)}>
      <[Feature]Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onRefresh={handleRefresh}
        lastUpdated={data?.lastUpdated}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <[Feature]Content
            data={processedData}
            activeTab={activeTab}
            filters={filters}
          />
        </div>

        <div className="lg:col-span-1">
          <[Feature]Sidebar
            data={processedData}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
}

// Display name for debugging
[Feature].displayName = '[Feature]';
```

#### 7.3 Chart Component Pattern (Recharts)

**File**: `src/components/professional/[feature]/[Feature]Chart.tsx`

```typescript
import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { [ChartData] } from './types';

interface [Feature]ChartProps {
  data: [ChartData][];
  height?: number;
  className?: string;
}

export function [Feature]Chart({
  data,
  height = 300,
  className,
}: [Feature]ChartProps) {
  // Format data for Recharts
  const chartData = useMemo(() => {
    return data.map(item => ({
      // ... data transformation
      timestamp: format(new Date(item.date), 'MMM dd'),
      value: item.value,
    }));
  }, [data]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">
          {payload[0].payload.timestamp}
        </p>
        <p className="text-xs text-muted-foreground">
          Value: {payload[0].value}
        </p>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))"
            vertical={false}
          />
          
          <XAxis
            dataKey="timestamp"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '20px',
            }}
          />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 8. DASHBOARD INTEGRATION

#### 8.1 Navigation Updates

**File**: `src/pages/professional/Dashboard.tsx`

**Modification 1: Add new nav items**

```typescript
// Find the navItems array (around line 80)
const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "overview", icon: FileText, label: "Research Overview" },
  { id: "risk", icon: Calculator, label: "Risk Calculator" },
  { id: "upload", icon: UploadCloud, label: "Data Upload" },
  { id: "reports", icon: FileText, label: "Reports" },
  
  // ADD NEW ITEMS HERE
  { id: "[new-feature-1]", icon: [Icon1], label: "[Label 1]" },
  { id: "[new-feature-2]", icon: [Icon2], label: "[Label 2]" },
  // ... more items
];
```

**Modification 2: Add route rendering**

```typescript
// Find the main content area tab rendering (around line 250)
{activeTab === "dashboard" && (
  <>
    {/* existing dashboard content */}
  </>
)}

{activeTab === "overview" && <ResearchOverview datasets={datasets} />}
{activeTab === "risk" && <RiskCalculator data={data} />}
{activeTab === "upload" && <DataUpload />}
{activeTab === "reports" && <Reports />}

// ADD NEW ROUTES
{activeTab === "[new-feature-1]" && <[NewFeature1Component] />}
{activeTab === "[new-feature-2]" && <[NewFeature2Component] />}
// ... more routes
```

**Modification 3: Import new components**

```typescript
// At the top of the file, add imports
import { [NewFeature1Component] } from './[new-feature-1]/[Component]';
import { [NewFeature2Component] } from './[new-feature-2]/[Component]';
// ... more imports
```

#### 8.2 State Management Integration

**If global state is needed**:

**File**: `src/contexts/[Feature]Context.tsx`

```typescript
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { [FeatureState], [FeatureActions] } from '@/types/[feature]';

interface [Feature]ContextValue extends [FeatureState] {
  actions: [FeatureActions];
}

const [Feature]Context = createContext<[Feature]ContextValue | undefined>(undefined);

export function [Feature]Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<[FeatureState]>({
    // ... initial state
  });

  const actions = useMemo(() => ({
    [actionName]: useCallback((payload: [Type]) => {
      setState(prev => ({
        ...prev,
        // ... state update
      }));
    }, []),
    // ... more actions
  }), []);

  const value = useMemo(() => ({
    ...state,
    actions,
  }), [state, actions]);

  return (
    <[Feature]Context.Provider value={value}>
      {children}
    </[Feature]Context.Provider>
  );
}

export function use[Feature]Context() {
  const context = useContext([Feature]Context);
  if (!context) {
    throw new Error('use[Feature]Context must be used within [Feature]Provider');
  }
  return context;
}
```

**Wrap Dashboard**:

```typescript
// In src/App.tsx or Dashboard.tsx
import { [Feature]Provider } from '@/contexts/[Feature]Context';

<[Feature]Provider>
  <Dashboard />
</[Feature]Provider>
```

### 9. STYLING & THEMING

#### 9.1 Theme Consistency

**File**: `src/index.css` (add new CSS variables if needed)

```css
@layer base {
  :root {
    /* Existing variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... existing vars */

    /* NEW FEATURE-SPECIFIC VARIABLES */
    --[feature]-primary: [hsl-value];
    --[feature]-secondary: [hsl-value];
    --[feature]-accent: [hsl-value];
  }

  .dark {
    /* Dark mode overrides */
    --[feature]-primary: [hsl-value];
    --[feature]-secondary: [hsl-value];
    --[feature]-accent: [hsl-value];
  }
}

/* FEATURE-SPECIFIC UTILITY CLASSES */
@layer utilities {
  .[feature]-gradient {
    background: linear-gradient(
      to right,
      hsl(var(--[feature]-primary)),
      hsl(var(--[feature]-secondary))
    );
  }

  .[feature]-glass {
    background: hsl(var(--background) / 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid hsl(var(--border) / 0.5);
  }
}
```

#### 9.2 Responsive Design Breakpoints

**Use Tailwind's default breakpoints consistently**:

```typescript
// Component responsive pattern
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
  {/* content */}
</div>
```

**For complex responsive logic**:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    // Conditional rendering based on breakpoints
  );
}
```

### 10. ERROR HANDLING STRATEGY

#### 10.1 Error Boundary Implementation

**File**: `src/components/ErrorBoundary.tsx`

```typescript
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Something went wrong
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

**Usage**:

```typescript
// Wrap each major feature
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('[Feature] Error:', error, errorInfo);
  }}
>
  <[FeatureComponent] />
</ErrorBoundary>
```

#### 10.2 API Error Handling

**Centralized error handler**:

**File**: `src/lib/errorHandler.ts`

```typescript
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
  retryable: boolean;
}

/**
 * Classify and handle errors consistently
 */
export function handleError(error: unknown): AppError {
  // Network error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Network connection failed. Please check your internet.',
        originalError: error,
        retryable: true,
      };
    }

    // API error with status code
    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION,
          message: data?.message || 'Invalid request',
          statusCode: status,
          retryable: false,
        };

      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Authentication failed. Please check your API key.',
          statusCode: status,
          retryable: false,
        };

      case 429:
        return {
          type: ErrorType.RATE_LIMIT,
          message: 'Rate limit exceeded. Please try again later.',
          statusCode: status,
          retryable: true,
        };

      case 500:
      case 502:
      case 503:
        return {
          type: ErrorType.API,
          message: 'Server error. Please try again.',
          statusCode: status,
          retryable: true,
        };

      default:
        return {
          type: ErrorType.API,
          message: data?.message || `API error: ${status}`,
          statusCode: status,
          retryable: status >= 500,
        };
    }
  }

  // Generic error
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      originalError: error,
      retryable: false,
    };
  }

  // Unknown error type
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    originalError: error,
    retryable: false,
  };
}

/**
 * Display error to user via toast
 */
export function displayError(error: AppError): void {
  const toastOptions = {
    duration: error.retryable ? 5000 : 4000,
  };

  switch (error.type) {
    case ErrorType.NETWORK:
      toast.error('Network Error', {
        description: error.message,
        ...toastOptions,
      });
      break;

    case ErrorType.AUTHENTICATION:
      toast.error('Authentication Error', {
        description: error.message,
        ...toastOptions,
      });
      break;

    case ErrorType.RATE_LIMIT:
      toast.warning('Rate Limit', {
        description: error.message,
        ...toastOptions,
      });
      break;

    default:
      toast.error('Error', {
        description: error.message,
        ...toastOptions,
      });
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const appError = handleError(error);

      if (!appError.retryable) {
        throw error;
      }

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

### 11. TESTING IMPLEMENTATION

#### 11.1 Unit Test Setup

**Install testing dependencies**:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitest/ui jsdom
```

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.tsx',
        '**/*.test.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**File**: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.VITE_OPENWEATHER_API_KEY = 'test-api-key';
```

#### 11.2 Component Test Template

**File**: `src/components/professional/[feature]/[Component].test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { [Component] } from './[Component]';
import { [feature]Service } from '@/services/[feature]Service';

// Mock the service
vi.mock('@/services/[feature]Service', () => ({
  [feature]Service: {
    [method]: vi.fn(),
  },
}));

// Mock data
const mockData: [DataType] = {
  // ... mock data structure
};

describe('[Component]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked([feature]Service.[method]).mockReturnValue(
      new Promise(() => {}) // Never resolves
    );

    render(<[Component] {...defaultProps} />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders data after successful fetch', async () => {
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    render(<[Component] {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch data';
    vi.mocked([feature]Service.[method]).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<[Component] {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    render(<[Component] {...defaultProps} />);

    const button = await screen.findByRole('button', { name: /action/i });
    await user.click(button);

    expect([feature]Service.[method]).toHaveBeenCalledTimes(2); // Initial + after click
  });

  it('refetches data on refresh button click', async () => {
    const user = userEvent.setup();
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    render(<[Component] {...defaultProps} />);

    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect([feature]Service.[method]).toHaveBeenCalledTimes(2);
  });
});
```

#### 11.3 Service Test Template

**File**: `src/services/[feature]Service.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { [feature]Service } from './[feature]Service';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('[Feature]Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    [feature]Service.clearCache();
  });

  describe('[method]', () => {
    it('fetches data successfully', async () => {
      const mockResponse = {
        data: {
          // ... API response
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await [feature]Service.[method](params);

      expect(result).toEqual(expectedTransformedData);
    });

    it('uses cached data on subsequent calls', async () => {
      const mockResponse = {
        data: {
          // ... API response
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      // First call
      await [feature]Service.[method](params);
      
      // Second call (should use cache)
      await [feature]Service.[method](params);

      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('handles network errors correctly', async () => {
      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('Network error')),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect([feature]Service.[method](params)).rejects.toThrow('Network error');
    });

    it('handles rate limit errors', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: { message: 'Rate limit exceeded' },
        },
        isAxiosError: true,
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(rateLimitError),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect([feature]Service.[method](params)).rejects.toThrow('Rate limit exceeded');
    });
  });
});
```

#### 11.4 Hook Test Template

**File**: `src/hooks/use[Feature].test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { use[Feature] } from './use[Feature]';
import { [feature]Service } from '@/services/[feature]Service';

vi.mock('@/services/[feature]Service');

describe('use[Feature]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data on mount', async () => {
    const mockData = { /* ... */ };
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    const { result } = renderHook(() => use[Feature](params));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles errors correctly', async () => {
    const error = new Error('Fetch failed');
    vi.mocked([feature]Service.[method]).mockRejectedValue(error);

    const { result } = renderHook(() => use[Feature](params));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeNull();
  });

  it('refetches data on refetch call', async () => {
    const mockData = { /* ... */ };
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    const { result } = renderHook(() => use[Feature](params));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refetch();

    expect([feature]Service.[method]).toHaveBeenCalledTimes(2);
  });

  it('polls data at specified interval', async () => {
    vi.useFakeTimers();
    
    const mockData = { /* ... */ };
    vi.mocked([feature]Service.[method]).mockResolvedValue(mockData);

    renderHook(() => use[Feature](params, { refetchInterval: 5000 }));

    await waitFor(() => {
      expect([feature]Service.[method]).toHaveBeenCalledTimes(1);
    });

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect([feature]Service.[method]).toHaveBeenCalledTimes(2);
    });

    vi.useRealTimers();
  });
});
```

### 12. PERFORMANCE OPTIMIZATION

#### 12.1 Code Splitting Strategy

**Implement lazy loading for feature components**:

```typescript
// In src/pages/professional/Dashboard.tsx

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const [Feature1] = lazy(() => 
  import('./[feature-1]/index').then(m => ({ default: m.[Feature1Component] }))
);

const [Feature2] = lazy(() => 
  import('./[feature-2]/index').then(m => ({ default: m.[Feature2Component] }))
);

// Loading fallback
function FeatureLoadingFallback() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

// In render
{activeTab === "[feature-1]" && (
  <Suspense fallback={<FeatureLoadingFallback />}>
    <[Feature1] />
  </Suspense>
)}
```

#### 12.2 Memoization Strategy

**File**: `src/components/professional/[feature]/[Component].tsx`

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive calculations
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Expensive data processing
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data.map(item => ({
      // ... heavy transformation
    }));
  }, [data]); // Only recompute when data changes

  // Memoize callbacks passed to children
  const handleItemClick = useCallback((id: string) => {
    // ... handler logic
  }, []); // Dependencies array

  return (
    <div>
      {processedData.map(item => (
        <ChildComponent 
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

// Memoize child components that receive stable props
const ChildComponent = memo(function ChildComponent({ item, onClick }: ChildProps) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});
```

#### 12.3 Virtual Scrolling for Large Lists

**Install dependency**:
```bash
npm install @tanstack/react-virtual
```

**Implementation**:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function LargeList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ItemComponent item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

#### 12.4 Image Optimization

**For static images**:

```typescript
// Use Vite's built-in optimization
import heroImage from '@/assets/hero.png?width=800&format=webp';

<img src={heroImage} alt="Hero" loading="lazy" />
```

**For dynamic images from APIs**:

```typescript
function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageOff className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
```

### 13. DEPLOYMENT CHECKLIST

#### 13.1 Pre-Deployment Steps

**Environment Variables**:
```bash
# Verify all required env vars are set
✓ VITE_OPENWEATHER_API_KEY
✓ VITE_CLERK_PUBLISHABLE_KEY
✓ DATABASE_URL
✓ [Any new API keys]

# Production-specific vars
✓ NODE_ENV=production
✓ VITE_API_BASE_URL=[production API URL]
```

**Build Optimization**:
```bash
# Run production build
npm run build

# Check build size
npm run build -- --analyze

# Verify no build errors
# Check dist/ folder size
```

**Database Migration**:
```bash
# Run migrations in staging first
npm run db:migrate -- --env staging

# Then production
npm run db:migrate -- --env production
```

#### 13.2 Deployment Verification

**Checklist after deployment**:
- [ ] All pages load without errors
- [ ] API connections working (check Network tab)
- [ ] Authentication flow functional
- [ ] Data fetching working across all features
- [ ] Charts rendering correctly
- [ ] Maps loading properly
- [ ] Responsive design working on mobile/tablet
- [ ] Dark mode toggling correctly
- [ ] Error handling displaying properly
- [ ] Loading states showing correctly
- [ ] No console errors
- [ ] Performance metrics acceptable (Lighthouse score)

#### 13.3 Monitoring Setup

**Add error tracking** (optional but recommended):

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### 14. ROLLBACK STRATEGY

**Git Workflow**:

```bash
# Create feature branch
git checkout -b feature/[feature-name]

# Make commits frequently with clear messages
git commit -m "feat([feature]): add [specific change]"

# Before merging to main, create backup branch
git checkout main
git checkout -b backup/pre-[feature]-integration

# Merge feature
git checkout main
git merge feature/[feature-name]

# If issues arise, quick rollback
git revert HEAD
# or
git reset --hard backup/pre-[feature]-integration
```

**Database Rollback**:

```sql
-- Keep rollback scripts for each migration
-- migrations/[timestamp]_add_[feature]_rollback.sql

DROP TABLE IF EXISTS [table_name];
-- ... reverse all changes
```

### 15. DOCUMENTATION REQUIREMENTS

#### 15.1 Code Documentation

**Component Documentation**:
```typescript
/**
 * [Component Name]
 * 
 * [Detailed description of purpose and behavior]
 * 
 * @component
 * @example
 * ```tsx
 * <[Component]
 *   prop1="value"
 *   prop2={data}
 *   onAction={handleAction}
 * />
 * ```
 * 
 * @param {[PropType]} props - Component props
 * @param {string} props.prop1 - [Description]
 * @param {[Type]} props.prop2 - [Description]
 * @param {Function} props.onAction - [Description]
 * 
 * @returns {JSX.Element} Rendered component
 * 
 * @remarks
 * - [Important note 1]
 * - [Important note 2]
 * 
 * @see [Related component or doc]
 */
```

#### 15.2 README Updates

**File**: `README.md` (add new sections)

```markdown
## New Features

### [Feature Name]

[Description of feature]

**Location**: Professional Dashboard → [Tab Name]

**Key Capabilities**:
- [Capability 1]
- [Capability 2]

**Data Sources**:
- OpenWeather API: [endpoints used]
- [Other sources]

**Configuration**:
```bash
# Required environment variables
VITE_[VARIABLE_NAME]=your_value
```

**Usage**:
```typescript
// Code example
```

**Troubleshooting**:
- Issue: [Common problem]
  - Solution: [How to fix]
```

#### 15.3 API Documentation

**File**: `docs/API.md`

```markdown
# API Integration Documentation

## [Feature] Service

### Endpoints

#### Get [Resource]

**Method**: `GET`
**URL**: `[endpoint-url]`
**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| lat | number | Yes | Latitude |
| lon | number | Yes | Longitude |

**Response**:
```json
{
  // Example response
}
```

**Error Codes**:
- 400: Invalid parameters
- 401: Authentication failed
- 429: Rate limit exceeded
```

### 16. IMPLEMENTATION TIMELINE

**Week 1: Foundation**
- Day 1-2: Dependencies, types, constants
- Day 3-4: Service layer, API integration
- Day 5: Custom hooks, state management

**Week 2: Core UI**
- Day 6-7: Base components (atoms)
- Day 8-9: Composite components (molecules)
- Day 10: Feature components (organisms)

**Week 3: Integration**
- Day 11-12: Dashboard integration
- Day 13: Responsive design refinement
- Day 14: Error handling, loading states

**Week 4: Polish**
- Day 15-16: Performance optimization
- Day 17-18: Testing, bug fixes
- Day 19: Documentation
- Day 20: Deployment

### 17. COMMUNICATION PROTOCOL

**Daily Updates**:
- Morning: Current task, blockers
- Evening: Progress, tomorrow's plan

**Git Commit Convention**:
```bash
feat([scope]): add [feature]
fix([scope]): resolve [bug]
docs([scope]): update [documentation]
style([scope]): format [changes]
refactor([scope]): restructure [code]
test([scope]): add [tests]
chore([scope]): update [dependencies]
```

**Pull Request Template**:
```markdown
## Changes
- [Change 1]
- [Change 2]

## Testing
- [ ] Unit tests passing
- [ ] Manual testing completed
- [ ] Responsive design verified

## Screenshots
[Before/After screenshots if UI changes]

## Deployment Notes
[Any special deployment considerations]
```

## TONE
- Highly technical and implementation-focused
- Prescriptive with exact code examples
- Systematic and methodical
- Accounts for edge cases and error scenarios
- Assumes intermediate-to-advanced developer knowledge
- Pragmatic about time/resource constraints
- Clear about dependencies and sequencing

## EXPECTED OUTPUT LENGTH
A comprehensive implementation guide of 5000-7000 words with complete code examples, file structures, configuration details, and step-by-step instructions that enable immediate development work.

---

**This guide provides everything needed to transform the specification into working code. Each section can be executed independently while maintaining overall system coherence. Follow the sequence, test incrementally, and document as you build.**
