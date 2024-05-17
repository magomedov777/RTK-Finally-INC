import { AppDispatch, AppRootStateType } from 'app/store'
import { handleServerNetworkError } from 'common/utils/handle-server-network-error'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { appActions } from 'app/app.reducer'
import { BaseResponseType } from 'common/types'

/**

Executes a thunk function with try-catch error handling and dispatches appropriate actions.
@template T - The type of the expected result from the logic function.
@param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>} thunkAPI - The object containing the dispatch and rejectWithValue functions.
@param {() => Promise<T>} logic - The logic function to be executed.
@returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} A promise that resolves to the result of the logic function or rejects with a value provided by thunkAPI.rejectWithValue.
*/

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
}
