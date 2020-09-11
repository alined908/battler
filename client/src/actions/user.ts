import {Dispatch} from 'redux'
import {axiosClient} from '../tools/axiosClient'
import * as types from '../constants/user'
import history from '../tools/browserHistory'

interface userData {
    username?: string
    email?: string
    password: string
}

export const login = (userData: userData) => (dispatch: Dispatch) => {
    axiosClient.request({
        url: `api/login/`,
        method: 'POST',
        data: userData
    }).then((response) => {
        console.log(response.data)
        localStorage.setItem('accessToken', response.data)
        const action = {
            type: types.SET_USER,
            payload: response.data
        }
        dispatch(action)
        history.push('/tournaments')
    }).catch((error) => {
        console.log(error)
        const action = {
            type: types.LOGIN_ERROR,
            payload: error
        }
        dispatch(action)
    })
}

export const signup = (userData: userData) => (dispatch: Dispatch) => {
    axiosClient.request({
        url: `api/users/`,
        method: 'POST',
        data: userData
    }).then((response) => {
        console.log(response.data)
        localStorage.setItem('accessToken', response.data)
        const action = {
            type: types.SET_USER,
            payload: response.data 
        }
        dispatch(action)
        history.push('/tournaments')
    }).catch((error) => {
        const action = {
            type: types.SIGNUP_ERROR,
            payload: error
        }
        dispatch(action)
    })
}

export const logout = () => (dispatch: Dispatch) => {
    const action = {
        type: types.LOG_OUT
    }
    dispatch(action)
}