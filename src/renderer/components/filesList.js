import React from "react"
import { Consumer } from "../store"
import { fsize, filename } from "../utils"
import Timeago from "../components/timeago"
import UploadButton from "../components/uploadButton"

const FileList = () => {
	const SaveInfo = ({ group, groupName }) => {
		const numFiles = group.length
		const filesSize = fsize(
			group.map(f => f.size).reduce((prev, curr) => prev + curr)
		)

		return (
			<>
				{groupName}
				<span className="d-block small text-muted text-lower">
					{numFiles} {`${numFiles > 1 ? "files" : "file"}`} -{" "}
					{filesSize} - Last change{" "}
					<Timeago date={group[0].mtimeMs} />
				</span>
			</>
		)
	}

	return (
		<Consumer inject="sortedWatchedFiles">
			{({ sortedWatchedFiles }) => {
				return (
					<table className="pure-table">
						<tbody>
							{sortedWatchedFiles &&
								sortedWatchedFiles.map((group, k) => {
									const groupName = filename(
										group[0].basename
									).split("_")[0]

									return (
										<React.Fragment key={k}>
											<tr>
												<th
													colSpan="3"
													scope="colgroup"
												>
													<SaveInfo
														group={group}
														groupName={groupName}
													/>
												</th>
												<th scope="colgroup">
													<UploadButton
														group={group}
														name={groupName}
													/>
												</th>
											</tr>

											<tr>
												<th>Save</th>
												<th>Created</th>
												<th>Modified</th>
												<th>Size</th>
											</tr>

											{group.map((file, k) => {
												return (
													<tr key={k}>
														<td>
															{filename(
																file.basename
															)}
														</td>
														<td>
															<Timeago
																date={
																	file.birthtimeMs
																}
																includeFull
															/>
														</td>
														<td>
															<Timeago
																date={
																	file.mtimeMs
																}
																includeFull
															/>
														</td>
														<td>
															{fsize(file.size)}
														</td>
													</tr>
												)
											})}
										</React.Fragment>
									)
								})}
						</tbody>
					</table>
				)
			}}
		</Consumer>
	)
}

export default FileList
