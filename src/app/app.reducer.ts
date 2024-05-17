import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { todolistsThunks } from 'features/TodolistsList/model/todolists.reducer'

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
}

export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      // .addMatcher(
      //   (action: UnknownAction) => {
      //     return action.type.endsWith('/pending')               --------------> base syntax, two callbacks
      //   },
      //   (state) => {
      //     state.status = 'loading'
      //   },
      // )
      .addMatcher(
        isPending /*{(todolistsThunks.addTodolist, , ,) -- only this action or another action}*/,
        (state) => {
          state.status = 'loading' //-------
        },
      )
      .addMatcher(isFulfilled, (state) => {
        state.status = 'succeeded' //---------> shorts syntax, without first callback
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.status = 'failed' //--------
        if (action.payload) {
          if (action.type === todolistsThunks.addTodolist.rejected.type) return
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
