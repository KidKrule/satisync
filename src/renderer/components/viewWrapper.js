import React from "react"
import Nav from "../components/nav"

const ViewWrapper = ({ children, withNav = true }) => {
	return (
		<>
			{withNav && <Nav />}
			<div className="viewWrapper">{children}</div>
		</>
	)
}

export default ViewWrapper
