import axios from "axios";
import { useState, Fragment } from "react";
import VideoPlayer from "../videoplayer/videoplayer.component";

const PlayerLogic = () => {
	const [videoFile, setVideoFile] = useState([]);
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
		axios
			.post("http://localhost:3001/reset")
			.then((res) => console.log(res.data))
			.catch((err) => console.log(err));
	};

	const inputHandler = (event) => {
		setLocationDir(event.target.value);
	};

	const locationSubmit = async (event) => {
		event.preventDefault();
		axios
			.post("http://localhost:3001/setLocation", { locationDir })
			.then((res) => {
				setVideoFile(res.data);
			})
			.catch((err) => console.log(err.response.data));
	};

	const videoChooser = (event) => {
		setCount(event.target.name);
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

			<div className="btn-group-vertical">
				{videoFile.map((file, index) => {
					return (
						<button
							type="button"
							className="btn btn-primary"
							name={index}
							onClick={videoChooser}
						>
							{file}
						</button>
					);
				})}
			</div>
			<VideoPlayer id={count} />
		</Fragment>
	);
};

export default PlayerLogic;
