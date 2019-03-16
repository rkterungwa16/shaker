import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'firebase';
import validator from 'validator';
import nexmo from 'nexmo';

import * as textMessageActions from './action'

import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode,
  FirebaseDatabaseMutation
} from '@react-firebase/database'

import { firebaseConfig } from './firebaseConfig'
import './App.css';

firebase.initializeApp(firebaseConfig)

class App extends Component {
  state = {
    pushedKey: '',
    limit: 5,
    firstName: {
      value: '',
      error: ''
    },
    secondName: {
      value: '',
      error: ''
    },
    thirdName: {
      value: '',
      error: ''
    },
    fourthName: {
      value: '',
      error: ''
    },
    fifthName: {
      value: '',
      error: ''
    }
  }

  validatePhoneNumber = (number) => validator.isMobilePhone(number, ['en-NG', 'en-GH'])

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (value && !this.validatePhoneNumber(value)) {
      console.log('not a phone number')
      this.setState({
        [name]: {
          error: 'Please enter a valid Nigerian or Ghanian Number'
        }
      })
    } else {
      this.setState({
        [name]: {
          value,
          error: ''
        }
      });
    }
  }
  renderNumbers = (numbers) => {
    let renderNumbers = <span></span>
    if (numbers.value) {
      renderNumbers = Object.keys(numbers.value).map((id) => {
        return (
          <span key={id}>{numbers.value[id].number}</span>
        )
      })
    }
    return renderNumbers;
  }

  aggregateNumbers = (state) => (
    [
      'firstName',
      'secondName',
      'thirdName',
      'fourthName',
      'fifthName'].map((value) => {
        return state[value].value
      })
  )

  sendTextMessage = (d) => {
    // d.value.numbers if d.value and d.value.numbers
    if (d.value && d.value.numbers && this.state.pushedKey) {
      this.props.textMessageActions.sendMessage(d.value.numbers)
    } 
  }

  validateAllInput (...numbers) {
    return numbers[0].every((number) => {
      return number.value
    })
  }

  render() {
    const {
      firstName,
      secondName,
      thirdName,
      fourthName,
      fifthName,
      pushedKey
    } = this.state
    const disabled = !this.validateAllInput([
      firstName, secondName, thirdName, fourthName, fifthName]) ? true : false
    return (
        <div className='App'>
          <header className='App-header'>
            <h1 className='header__text'>Found Me</h1>
              {
                !pushedKey ?
                <div className='name-input__wrapper'>
                <span className='name-input__text'>You can add 5 close people to help you in case of issue</span>
                <div className='name-input__group'>
                    <span
                      className='error__msg'
                    >{firstName.error}</span>
                  <input
                    type='text'
                    name='firstName'
                    className='number__input'
                    placeholder='PHONE NUMBER 1'
                    onChange={this.handleInputChange}
                  />
                  <span
                      className='error__msg'
                    >{secondName.error}</span>
                  <input
                    type='text'
                    name='secondName'
                    className='number__input'
                    placeholder='PHONE NUMBER 2'
                    onChange={this.handleInputChange}
                  />
                  <span
                      className='error__msg'
                    >{thirdName.error}</span>
                  <input
                    type='text'
                    name='thirdName'
                    className='number__input'
                    placeholder='PHONE NUMBER 3'
                    onChange={this.handleInputChange}
                  />
                  <span
                      className='error__msg'
                    >{fourthName.error}</span>
                  <input
                    type='text'
                    name='fourthName'
                    className='number__input'
                    placeholder='PHONE NUMBER 4'
                    onChange={this.handleInputChange}
                  />
                  <span
                      className='error__msg'
                    >{fifthName.error}</span>
                  <input
                    type='text'
                    name='fifthName'
                    className='number__input'
                    placeholder='PHONE NUMBER 5'
                    onChange={this.handleInputChange}
                  />
                  {
                    disabled ?
                    <button
                      className='disabled-btn text-btn'
                      disabled={
                        disabled
                      } 
                    >
                      Validate input
                    </button>:
                    <FirebaseDatabaseProvider firebase={firebase} {...firebaseConfig}>
                      <FirebaseDatabaseMutation type="push" firebase={firebase} path='/'>
                          {({ runMutation }) => {
                            return (
                              <button
                                className='btn text-btn'
                                onClick={async () => {
                                  // this.setState(state => ({ limit: state.limit + 5 }));
                                  
                                  const { key } = await runMutation({
                                    name: 'Guest',
                                    numbers: this.aggregateNumbers(this.state)
                                  });
                                  this.setState({ pushedKey: key })
                                }}
                              >
                                Validate input
                              </button>
                            );
                          }}
                        </FirebaseDatabaseMutation>
                      </FirebaseDatabaseProvider>
                  }
                  
                  </div>
                </div> :
                <div className='shakeup__wrapper'>
                  <FirebaseDatabaseProvider firebase={firebase} {...firebaseConfig}>
          
                    <FirebaseDatabaseNode
                        path={`/${this.state.pushedKey}`}
                      >
                        {d => {
                          console.log('value of user', d)
                          // d.value.numbers if d.value and d.value.numbers
                          return (
                            <div
                              className='shake__btn'
                              data-testid="test-push"
                              onClick={this.sendTextMessage(d)}
                            >
                            
                              Shake Up
                            </div>
                          )
                        }}
                      </FirebaseDatabaseNode>
                    </FirebaseDatabaseProvider>
                  <span
                    className='shakeup-msg__text'
                  >You can now send text to your emergency contacts</span>
                </div>
              }
            </header>
        
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    message: state.messageReducer.message
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    textMessageActions: bindActionCreators(textMessageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

