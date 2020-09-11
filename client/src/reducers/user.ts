import {SET_USER, LOG_OUT} from '../constants/user'
import jwt_decode from 'jwt-decode'

interface action {
    payload: any
    type: string
}

interface JWT {
    exp: number
    jti: string
    token_type: string
    user: {}
    user_id: number
}

const defaultState = {
    isAuthenticated: false,
    accessToken: null,
    user: {}
}

const userReducer = (state = defaultState, action: action) => {
    switch(action.type){
        case SET_USER:
            console.log(jwt_decode(action.payload))
            return {
                isAuthenticated: true,
                accessToken: action.payload,
                user: (jwt_decode(action.payload) as JWT).user
            }
        case LOG_OUT:
            return {
                isAuthenticated: false,
                accessToken: null,
                user: {}
            }
        default: 
            return state
    }
}

export default userReducer