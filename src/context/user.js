import { createContext, useState, useEffect } from 'react'
import { createUserDocumentFromAuth, onAuthStateChangedListener } from '../utilities/firebase/firebase'

const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null
})

const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(user => {
            createUserDocumentFromAuth(user)
            setCurrentUser(user)
        })
        return unsubscribe
    }, [])
    return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }