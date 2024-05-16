import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from 'app/app.reducer'
import { authAPI, LoginParamsType } from 'features/auth/api/auth.api'
import { clearTasksAndTodolists } from 'common/actions'
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from 'common/utils'
import { ResultCode } from 'common/enums'

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      // isAnyOf(
      //   authThunks.login.fulfilled,
      //   authThunks.logout.fulfilled, //short case | use instead first callback
      //   authThunks.initializeApp.fulfilled,
      // ),
      isFulfilled(
        authThunks.login,
        authThunks.logout, //isFulfilled the best for this case
        authThunks.initializeApp,
      ),
      // if (
      //   action.type === '/auth/login/fulfilled' ||
      //   action.type === '/auth/logout/fulfilled' ||
      //   action.type === '/auth/initializeApp/fulfilled'
      // ) {
      //   return true
      // } else {
      //   return false
      // }

      (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn
      },
    )
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(arg)
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(res.data, dispatch, isShowAppError)
        return rejectWithValue(res.data)
      }
    })
  },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.logout()
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(clearTasksAndTodolists())
        return { isLoggedIn: false }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue(res.data)
      }
    }).finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
  },
)

export const authSlice = slice.reducer
export const authThunks = { login, logout, initializeApp }
