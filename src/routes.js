import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Form from './Components/Form'
import Profile from './Components/Profile'
import Chat from './Components/Chat'

export default (
    <Switch>
        {/* when you edit a game you have posted, or select a game on your profile and want to view that game */}
        <Route path='/add/:id' component={Form} />
        <Route path='/dashboard/:id' component={Dashboard} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/chat/:id/:sessionUser/:email' component={Chat}/>
        {/* these three can be accessed in the header */}
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/add' component={Form} />
        <Route path='/profile' component={Profile} />
    </Switch>
)