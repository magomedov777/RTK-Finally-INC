import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'

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
      .addMatcher(isRejected, (state) => {
        state.status = 'failed' //--------
      })
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
