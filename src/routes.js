import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Form from './Components/Form'
import Game from './Components/Game'
import GameDisplay1 from './Components/GameDisplay1'
import GameDisplay2 from './Components/GameDisplay2'
import Profile from './Components/Profile'

export default (
    <Switch>
        {/* these three can be accessed in the header */}
        <Route exact path='/' component={Dashboard} />
        <Route path='/add' component={Form} />
        <Route path='/profile' component={Profile} />
        {/* these three will only be displayed and can't be accessed in the header */}
        <Route path='/display1' component={GameDisplay1} />
        <Route path='/display2' component={GameDisplay2} />
        <Route path='/other' component={Game} />
    </Switch>
)