import axios from "axios";
import { useState, Fragment } from "react";
import ReactPlayer from "react-player";
import "./playerlogic.styles.scss";

const PlayerLogic = () => {
	const [videoFile, setVideoFile] = useState([]);
	const [filePresent, setFilePresent] = useState(false);
	const [locationDir, setLocationDir] = useState("");
	const [count, setCount] = useState(0);

	// const videoFileHandler = (event) => {
	// 	console.log(event.target.files);
	// 	setVideoFile(URL.createObjectURL(event.target.files[0]));
	// 	console.log(videoFile);
	// };

	const resetInput = () => {
		setLocationDir("");
		setVideoFile([]);
		setFilePresent(false);
		axios
			.post("http://192.168.1.6:3001/reset")
			.then((res) => console.log(res.data))
			.catch((err) => console.log(err));
	};

	const inputHandler = (event) => {
		setLocationDir(event.target.value);
	};

	const locationSubmit = (event) => {
		event.preventDefault();
		axios
			.post("http://192.168.1.6:3001/setLocation", { locationDir })
			.then((res) => {
				setVideoFile(res.data);
				setFilePresent(true);
			})
			.catch((err) => console.log(err.response.data));
	};

	const videoChooser = (event) => {
		setCount(event.target.name);
		console.log(count);
	};

	return (
		<Fragment>
			<form onSubmit={locationSubmit}>
				<div className="mb-3">
					<label htmlFor="locationInput" className="form-label">
						Enter the absolute path of directory
					</label>
					<input
						id="locationInput"
						className="form-control"
						type="text"
						value={locationDir}
						onChange={inputHandler}
					/>
				</div>
				<div className="d-flex justify-content-between">
					<button className="btn btn-primary border border-3">
						Submit
					</button>
					<button
						className="btn btn-secondary border border-3"
						onClick={resetInput}
						type="button"
					>
						Reset
					</button>
				</div>
			</form>

			<div className="container-sm">
				<div className="btn-group-vertical">
					{videoFile.map((file, index) => {
						return (
							<button
								type="button"
								className="btn btn-primary"
								name={index}
								onClick={videoChooser}
								key={index}
							>
								{file}
							</button>
						);
					})}
				</div>
				{filePresent && (
					<ReactPlayer
						className="video-player"
						url={`http://192.168.1.6:3001/videos/${count}`}
						width="50%"
						height="50%"
						config={{
							file: {
								attributes: {
									preload: "metadata",
								},
							},
						}}
						controls={true}
					/>
				)}
			</div>
		</Fragment>
	);
};

export default PlayerLogic;
