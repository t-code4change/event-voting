import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = 'login' | 'register' | 'payment' | null
export type PostLoginAction = 'create-event' | 'payment' | 'dashboard' | null

interface ModalState {
  activeModal: ModalType
  postLoginAction: PostLoginAction
  redirectPath: string | null
  selectedPlan: {
    name: string
    price: string
    description: string
  } | null
}

const initialState: ModalState = {
  activeModal: null,
  postLoginAction: null,
  redirectPath: null,
  selectedPlan: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openLoginModal: (state, action: PayloadAction<{ postLoginAction?: PostLoginAction; redirectPath?: string }>) => {
      state.activeModal = 'login'
      state.postLoginAction = action.payload.postLoginAction || null
      state.redirectPath = action.payload.redirectPath || null
    },
    openRegisterModal: (state) => {
      state.activeModal = 'register'
    },
    openPaymentModal: (state, action: PayloadAction<{ name: string; price: string; description: string }>) => {
      state.activeModal = 'payment'
      state.selectedPlan = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
      state.postLoginAction = null
      state.redirectPath = null
      state.selectedPlan = null
    },
    switchToLogin: (state) => {
      state.activeModal = 'login'
    },
    switchToRegister: (state) => {
      state.activeModal = 'register'
    },
    setPostLoginAction: (state, action: PayloadAction<{ action: PostLoginAction; redirectPath?: string }>) => {
      state.postLoginAction = action.payload.action
      state.redirectPath = action.payload.redirectPath || null
    },
  },
})

export const {
  openLoginModal,
  openRegisterModal,
  openPaymentModal,
  closeModal,
  switchToLogin,
  switchToRegister,
  setPostLoginAction,
} = modalSlice.actions
export default modalSlice.reducer
