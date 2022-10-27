import { Provider } from 'react-redux'
import { store } from '../app/store'
import '../styles/globals.css'
import { UserProvider } from '../context/user'

export default ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  )
}
