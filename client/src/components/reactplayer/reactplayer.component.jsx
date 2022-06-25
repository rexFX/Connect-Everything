import axios from "axios";
import { useState, Fragment } from "react";
// import ReactPlayer from "react-player";

const VideoPlayer = () => {
	// const [videoFile, setVideoFile] = useState();
	const [locationDir, setLocationDir] = useState("");

	// const videoFileHandler = (event) => {
	// 	console.log(event.target.files);
	// 	setVideoFile(URL.createObjectURL(event.target.files[0]));
	// 	console.log(videoFile);
	// };

	const resetInput = () => {
		setLocationDir("");
	};

	const inputHandler = (event) => {
		setLocationDir(event.target.value);
	};

	const locationSubmit = async (event) => {
		event.preventDefault();
		axios
			.post("http://localhost:3001/setLocation", { locationDir })
			.then((res) => console.log(res.data))
			.catch((err) => console.log(err.response.data));
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

			{/* <input type="file" onChange={videoFileHandler} multiple />
			<ReactPlayer
				className="video-player"
				url={videoFile}
				width="50%"
				height="50%"
				controls={true}
			/> */}
		</Fragment>
	);
};

export default VideoPlayer;
