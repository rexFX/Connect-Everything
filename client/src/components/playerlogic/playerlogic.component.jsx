import axios from "axios";
import { useState } from "react";
import ReactPlayer from "react-player";
import "./playerlogic.styles.css";

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
		setErrorText("");
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
			setErrorText("Add valid IP and Port");
		} else {
			axios
				.get(`http://${tempIP}:${tempPort}/`)
				.then((res) => {
					if (res.data === "Connected") {
						setServerIP(tempIP);
						setServerPort(tempPort);
						setCheckIPandPort(true);
						setErrorText("");
					} else {
						setErrorText("IP and Port incorrect");
						ipPortAndBelowReset();
					}
				})
				.catch((err) => setErrorText("Invalid URL"));
		}
	};

	const ipPortAndBelowReset = () => {
		setServerIP("");
		setServerPort("");
		setTempPort("");
		setTempIP("");
		setCheckIPandPort(false);
		setErrorText("");
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
		<>
			{!checkIPandPort && (
				<form onSubmit={ipAndPortSubmit}>
					<div className="font-Poppins text-center flex flex-col justify-center items-center">
						<input
							id="ipInput"
							className="w-64 h-10 p-3 rounded-md bg-slate-100 outline-gray-300 outline-1 outline-offset-1"
							type="text"
							value={tempIP}
							placeholder="Local / Public IP of the Server"
							onChange={inputIPHandler}
						/>
						<input
							id="portInput"
							className="w-64 h-10 rounded-md mt-2 p-3 bg-slate-100 outline-gray-300 outline-1 outline-offset-1"
							type="text"
							value={tempPort}
							placeholder="Enter Port of the Server"
							onChange={inputPortHandler}
						/>
					</div>
					<div className="flex flex-col justify-center items-center">
						<div className="flex justify-evenly w-[20em] mt-4 font-Poppins">
							<button className="transition bg-red-400 w-[7em] h-[3em] hover:bg-red-600 hover:delay-50">
								Submit
							</button>
							<button
								className="transition bg-gray-400 w-[7em] h-[3em] hover:bg-slate-500 hover:delay-50"
								onClick={ipPortAndBelowReset}
								type="button"
							>
								Reset
							</button>
						</div>
						{errorText.length > 0 && (
							<div className="text-red-700 pt-6 font-Poppins">
								{errorText}!
							</div>
						)}
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
		</>
	);
};

export default PlayerLogic;
