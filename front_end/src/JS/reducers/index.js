import {combineReducers} from "redux"
import {userReducer} from "./userReducer"
import { salleReducer } from "./salleReducer"
import { reservationReducer } from "./reservationReducer"

export const rootReducer=combineReducers({salleReducer,userReducer,reservationReducer})