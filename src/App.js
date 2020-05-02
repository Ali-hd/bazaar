import React, { Suspense, lazy, Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Loader from './components/Loader'
import NavBar from './components/NavBar'
import {StoreProvider} from './store/store'
import ScrollTopTop from './helpers/ScrollToTop'
import 'dotenv/config'


const Home = lazy(()=> import('./components/Home'))
const Login = lazy(()=> import('./components/Login'))
const Register = lazy(()=> import('./components/Register'))
const Sell = lazy(()=>import('./components/Sell'))
const Profile = lazy(()=>import('./components/Profile'))
const Post = lazy(()=>import('./components/Post'))
const Messages = lazy(()=>import('./components/Messages'))

function App(){
  return (
    <div>
    <StoreProvider>
    <BrowserRouter>
        <Suspense fallback={<Loader />}>
        <ScrollTopTop/>
        <NavBar/>
        <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/sell" exact>
              <Sell />
            </Route>
            <Route path="/user/:username" exact>
              <Profile />
            </Route>
            <Route path="/post/:id" exact>
              <Post />
            </Route>
            <Route path="/user/:username/messages" exact>
              <Messages />
            </Route>
        </Switch>
        </Suspense>
    </BrowserRouter>
    </StoreProvider>
    </div>
  )
}

export default App

