import React from 'react'
import PropTypes from 'prop-types';

export const Context = React.createContext({})

export class ContextProvider extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    wallet: null
  }


  // reimplementation of setState, but specifically for context state.
  setContext = (state, fn) => {
    this.setState(state, () => {
      if (fn) {
        fn()
      }
    })
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          setContext: this.setContext
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const ContextConsumer = Context.Consumer