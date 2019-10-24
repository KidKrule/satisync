import React from "react"
import { Link } from "react-router-dom"

const Nav = () => {
	return (
		<div className="pure-menu pure-menu-horizontal">
			<Link to="/" className="pure-menu-heading pure-menu-link">
				Sati<span>sync</span>
			</Link>
			<ul className="pure-menu-list">
				<li className="pure-menu-item">
					<Link to="/settings" className="pure-menu-link">
						Settings
					</Link>
				</li>
			</ul>
		</div>
	)
}

export default Nav