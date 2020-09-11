import { createStore, applyMiddleware, compose} from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from '../reducers/index'
import jwt_decode from "jwt-decode";

interface JWT {
  exp: number
  jti: string
  token_type: string
  user: {}
  user_id: number
}

export const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;



if (localStorage.getItem('accessToken')){
  (function checkExpiration(){
    const expiration = (jwt_decode(localStorage.getItem('accessToken') as string) as JWT).exp
    if (Date.now() >= expiration * 1000){
      localStorage.removeItem('accessToken')
    } 
  })();
}


const accessToken = localStorage.getItem('accessToken');
const user = accessToken ? (jwt_decode(accessToken) as JWT).user : {}

export const store = createStore(
    rootReducer, 
    {
      userReducer: {
        user,
        accessToken,
        isAuthenticated: accessToken !== null
      }
    },
    composeEnhancers(applyMiddleware(reduxThunk))
)

