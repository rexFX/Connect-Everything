import axios from "axios";
import { useState, Fragment } from "react";
import ReactPlayer from "react-player";
import "./playerlogic.styles.scss";

const PlayerLogic = () => {
	const [videoFile, setVideoFile] = useState([]);
	const [filePresent, setFilePresent] = useState(false);
	const [locationDir, setLocationDir] = useState("");
	const [count, setCount] = useState(0);
	const [serverIP, setServerIP] = useState("");
	const [serverPort, setServerPort] = useState("");
	const [checkIPandPort, setCheckIPandPort] = useState(false);
	const [tempIP, setTempIP] = useState("");
	const [tempPort, setTempPort] = useState("");
	const [mediaFilePlaybackError, setMediaFilePlaybackError] = useState(false);
	const [errorText, setErrorText] = useState("");

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
			.post(`http://${serverIP}:${serverPort}/reset`)
			.then((res) => console.log(res.data))
			.catch((err) => console.log(err));
	};

	const inputLocationHandler = (event) => {
		setLocationDir(event.target.value);
	};

	const inputIPHandler = (event) => {
		setTempIP(event.target.value);
	};

	const inputPortHandler = (event) => {
		setTempPort(event.target.value);
	};

	const ipAndPortSubmit = (event) => {
		event.preventDefault();
		if (!tempIP || !tempPort) {
			alert("Add valid IP and Port");
		} else {
			axios
				.get(`http://${tempIP}:${tempPort}/`)
				.then((res) => {
					if (res.data === "Connected") {
						alert("Connected!");
						setServerIP(tempIP);
						setServerPort(tempPort);
						setCheckIPandPort(true);
					} else {
						alert("IP and Port incorrect");
						ipPortAndBelowReset();
					}
				})
				.catch((err) => alert("Invalid URL"));
		}
	};

	const ipPortAndBelowReset = () => {
		setServerIP("");
		setServerPort("");
		setTempPort("");
		setTempIP("");
		setCheckIPandPort(false);
		resetInput();
	};

	const locationSubmit = (event) => {
		event.preventDefault();
		axios
			.post(`http://${serverIP}:${serverPort}/setLocation`, {
				locationDir,
			})
			.then((res) => {
				setVideoFile(res.data);
				setFilePresent(true);
				setErrorText("");
			})
			.catch((err) => {
				setVideoFile([]);
				setFilePresent(false);
				setErrorText(err.response.data);
			});
	};

	const videoChooser = (event) => {
		setCount(event.target.name);
		setMediaFilePlaybackError(false);
		console.log(count);
	};

	return (
		<Fragment>
			{!checkIPandPort && (
				<form onSubmit={ipAndPortSubmit}>
					<div className="mb-3">
						<label htmlFor="ipInput" className="form-label">
							Enter Local or Public IP of the server (without
							'http://')
						</label>
						<input
							id="ipInput"
							className="form-control"
							type="text"
							value={tempIP}
							onChange={inputIPHandler}
						/>
						<label htmlFor="portInput" className="form-label">
							Enter port of the server
						</label>
						<input
							id="portInput"
							className="form-control"
							type="text"
							value={tempPort}
							onChange={inputPortHandler}
						/>
					</div>
					<div className="d-flex justify-content-between">
						<button className="btn btn-primary border border-3">
							Submit
						</button>
						<button
							className="btn btn-secondary border border-3"
							onClick={ipPortAndBelowReset}
							type="button"
						>
							Reset
						</button>
					</div>
				</form>
			)}

			{checkIPandPort && (
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
							onChange={inputLocationHandler}
						/>
					</div>
					{errorText.length > 0 && <div>{errorText}</div>}
					<div className="d-flex justify-content-between m-2">
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
			)}

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
					<div>
						<ReactPlayer
							className="video-player"
							url={`http://${serverIP}:${serverPort}/videos/${count}`}
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
							onError={() => setMediaFilePlaybackError(true)}
						/>
						{mediaFilePlaybackError && (
							<div>Media file is not supported</div>
						)}
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default PlayerLogic;
