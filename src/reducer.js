import {
    SEND_TEXT_MESSAGE_FAILED,
    SEND_TEXT_MESSAGE_REQUESTED,
    SEND_TEXT_MESSAGE_SUCCEEDED
} from './constant'

import { combineReducers } from 'redux'

const initialState = {
    message: {},
    sendMessageRequest: false,
    sendMessageError : null
}

const sendMessage = (state=initialState, action) => {
    switch(action.type) {
        case SEND_TEXT_MESSAGE_REQUESTED:
        return Object.assign({}, {
            message: {},
            sendMessageRequest: true,
            sendMessageError: null
        })

        case SEND_TEXT_MESSAGE_SUCCEEDED:
        return Object.assign({}, {
            message: action.data,
            sendMessageRequest: false,
            sendMessageError: null
        })

        case SEND_TEXT_MESSAGE_FAILED:
        return Object.assign({}, {
            message: {},
            sendMessageRequest: false,
            sendMessageError: action.data
        })

        default: return state
    }
}

export default combineReducers({
    messageReducer: sendMessage
});