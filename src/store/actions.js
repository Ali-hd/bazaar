import types from './typeActions'

//actions will go through the middleware first them from there you can dispatch other actions to the reducers
export const useActions = (state, dispatch) => ({
    loginUser: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.LOGIN, payload: data})
    },
    userActions: data => {
        if(data.type == "alert close"){
            dispatch({type: types.SET_STATE, payload: {alert: null}})
        }
    }
})