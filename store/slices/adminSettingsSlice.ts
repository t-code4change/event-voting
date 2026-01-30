import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Feature definition
export interface AdminFeature {
  id: string
  name: string
  enabled: boolean
  icon: string
  path: string
  order: number
  description?: string
}

// Admin settings state
interface AdminSettingsState {
  features: AdminFeature[]
  sidebarCollapsed: boolean
  activeEventId: number | null
}

// Default features - 4 core features enabled by default
const defaultFeatures: AdminFeature[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    enabled: true,
    icon: 'Home',
    path: '/admin/dashboard',
    order: 0,
    description: 'Tổng quan sự kiện',
  },
  {
    id: 'guests',
    name: 'Danh sách Guest',
    enabled: true,
    icon: 'Users',
    path: '/admin/guests',
    order: 1,
    description: 'Quản lý khách mời',
  },
  {
    id: 'participants',
    name: 'Participants',
    enabled: true,
    icon: 'UserCheck',
    path: '/admin/participants',
    order: 2,
    description: 'Khách đã check-in',
  },
  {
    id: 'emails',
    name: 'Quản lý Email',
    enabled: true,
    icon: 'Mail',
    path: '/admin/emails',
    order: 3,
    description: 'Gửi email hàng loạt',
  },
  // Future features (disabled by default)
  {
    id: 'check-in',
    name: 'Check-in',
    enabled: false,
    icon: 'ScanLine',
    path: '/admin/check-in',
    order: 4,
    description: 'Quét mã check-in',
  },
  {
    id: 'draw-results',
    name: 'Kết quả quay số',
    enabled: false,
    icon: 'Gift',
    path: '/admin/draw-results',
    order: 5,
    description: 'Xem kết quả quay số',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    enabled: false,
    icon: 'TrendingUp',
    path: '/admin/analytics',
    order: 6,
    description: 'Thống kê chi tiết',
  },
  {
    id: 'settings',
    name: 'Cài đặt',
    enabled: true, // Always enabled
    icon: 'Settings',
    path: '/admin/settings',
    order: 99,
    description: 'Cấu hình hệ thống',
  },
]

const initialState: AdminSettingsState = {
  features: defaultFeatures,
  sidebarCollapsed: false,
  activeEventId: null,
}

const adminSettingsSlice = createSlice({
  name: 'adminSettings',
  initialState,
  reducers: {
    // Toggle a single feature
    toggleFeature: (state, action: PayloadAction<string>) => {
      const feature = state.features.find((f) => f.id === action.payload)
      if (feature && feature.id !== 'settings') {
        // Settings always enabled
        feature.enabled = !feature.enabled
      }
    },

    // Enable multiple features
    enableFeatures: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((featureId) => {
        const feature = state.features.find((f) => f.id === featureId)
        if (feature) {
          feature.enabled = true
        }
      })
    },

    // Disable multiple features
    disableFeatures: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((featureId) => {
        const feature = state.features.find((f) => f.id === featureId)
        if (feature && feature.id !== 'settings') {
          feature.enabled = false
        }
      })
    },

    // Set all features at once
    setFeatures: (state, action: PayloadAction<AdminFeature[]>) => {
      state.features = action.payload
    },

    // Update feature order
    reorderFeatures: (state, action: PayloadAction<{ id: string; newOrder: number }[]>) => {
      action.payload.forEach(({ id, newOrder }) => {
        const feature = state.features.find((f) => f.id === id)
        if (feature) {
          feature.order = newOrder
        }
      })
      // Sort by order
      state.features.sort((a, b) => a.order - b.order)
    },

    // Toggle sidebar collapsed state
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    // Set sidebar collapsed state
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },

    // Set active event
    setActiveEventId: (state, action: PayloadAction<number | null>) => {
      state.activeEventId = action.payload
    },

    // Reset to default features
    resetFeatures: (state) => {
      state.features = defaultFeatures
    },
  },
})

// Selectors
export const selectEnabledFeatures = (state: { adminSettings: AdminSettingsState }) =>
  state.adminSettings.features
    .filter((f) => f.enabled)
    .sort((a, b) => a.order - b.order)

export const selectAllFeatures = (state: { adminSettings: AdminSettingsState }) =>
  [...state.adminSettings.features].sort((a, b) => a.order - b.order)

export const selectFeatureById = (id: string) => (state: { adminSettings: AdminSettingsState }) =>
  state.adminSettings.features.find((f) => f.id === id)

export const selectSidebarCollapsed = (state: { adminSettings: AdminSettingsState }) =>
  state.adminSettings.sidebarCollapsed

export const selectActiveEventId = (state: { adminSettings: AdminSettingsState }) =>
  state.adminSettings.activeEventId

export const {
  toggleFeature,
  enableFeatures,
  disableFeatures,
  setFeatures,
  reorderFeatures,
  toggleSidebar,
  setSidebarCollapsed,
  setActiveEventId,
  resetFeatures,
} = adminSettingsSlice.actions

export default adminSettingsSlice.reducer
