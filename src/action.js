import axios from 'axios'
import nexmo from 'nexmo'

import {
    SEND_TEXT_MESSAGE_FAILED,
    SEND_TEXT_MESSAGE_SUCCEEDED,
    SEND_TEXT_MESSAGE_REQUESTED,
    BASE_URL
} from './constant'

import {
    apiKey,
    apiSecret
} from './nexmoConfig'

// const nexmo = new Nexmo({
//   apiKey: 'fd552bcb',
//   apiSecret: '6zqhk02Koc7uGZCP'
// })



// const from = 'Nexmo'
// const to = '2348135833305'
// const text = 'Hello from Nexmo'

// nexmo.message.sendSms(from, to, text)

export const sendMessageSuccess = (payload) => {
    return {
        type: SEND_TEXT_MESSAGE_SUCCEEDED,
        data: payload
    }
}

export const sendMessageFailure = (payload) => {
    return {
        type: SEND_TEXT_MESSAGE_FAILED,
        data: payload
    }
}

export const sendMessageRequest = (value) => {
    return {
        type: SEND_TEXT_MESSAGE_REQUESTED,
        data: value
    }
}

export const sendMessage = (...numbers) => {
    console.log('sent numbers', numbers[0])
    return (dispatch) => {
        dispatch(sendMessageRequest(true))
        const sentTexts = numbers[0].map((number) => {
            const requestBody = {
                api_key: apiKey,
                api_secret: apiSecret,
                from: 'Guest',
                to: number,
                text: 'I NEED HELP'
            }
              
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            return axios(BASE_URL, requestBody, config)
        })
        Promise.all(sentTexts)
        .then((response) => {
            dispatch(sendMessageRequest(false))
            return dispatch(sendMessageSuccess(response))
        })
        .catch((err) => {
            dispatch(sendMessageFailure(err))
        })
    }
}

// export const getList = () => {
//     return (dispatch) => {
//       dispatch(fetchListRequest(true))
//       axios
//           .get(BASE_URL)
//           .then(response => {
//             dispatch(fetchListRequest(false))
//             return dispatch(fetchListSuccess(response.data));
  
//           })
//           .catch(err => {
//             return dispatch(fetchListFailure(err));
//           });
//     }
  
//   };