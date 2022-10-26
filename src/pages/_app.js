import { Provider } from 'react-redux'
import { store } from '../app/store'
import '../styles/globals.css'
import { UserProvider } from '../context/user'

const MyApp = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  )
}

export default MyApp
