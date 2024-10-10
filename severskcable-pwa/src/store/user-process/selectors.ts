import {State} from "../../types/state.type";
import {AuthorizationStatus, NameSpace} from "../../constants";
import {UserType} from "../../types/initialState.type";

export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[NameSpace.User].authorizationStatus;
export const getUser = (state: State): UserType => state[NameSpace.User].user;

export const getAuthCheckedStatus = (state: State): boolean => state[NameSpace.User].authorizationStatus !== AuthorizationStatus.Unknown;