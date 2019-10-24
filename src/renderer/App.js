import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Home from "./views/home"
import Settings from "./views/settings"

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/settings" component={Settings} />
			</Switch>
		</Router>
	)
}

export default App
