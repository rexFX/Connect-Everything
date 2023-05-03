import axios from "axios";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import "./playerlogic.styles.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const PlayerLogic = () => {
	const videoFile = useRef([]);
	const [filePresent, setFilePresent] = useState(false);
	const [locationDir, setLocationDir] = useState("");
	const [count, setCount] = useState(-1);
	const [serverIP, setServerIP] = useState("");
	const [serverPort, setServerPort] = useState("");
	const [checkIPandPort, setCheckIPandPort] = useState(false);
	const [tempIP, setTempIP] = useState("");
	const [tempPort, setTempPort] = useState("");
	const [mediaFilePlaybackError, setMediaFilePlaybackError] = useState(false);
	const [errorText, setErrorText] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// const videoFileHandler = (event) => {
	// 	console.log(event.target.files);
	// 	setVideoFile(URL.createObjectURL(event.target.files[0]));
	// 	console.log(videoFile);
	// };

	const resetInput = () => {
		setCount(-1);
		setLocationDir("");
		videoFile.current = [];
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
				videoFile.current = res.data;
				setFilePresent(true);
				setErrorText("");
			})
			.catch((err) => {
				videoFile.current = [];
				setFilePresent(false);
				setErrorText(err.response.data);
			});
	};

	const videoChooser = (event) => {
		setCount(event.target.id);
		setMediaFilePlaybackError(false);
	};

	return (
		<div
			className={`h-screen w-screen fixed bg-gradient-to-r from-slate-500 to-yellow-100 flex flex-col lg:flex-row lg:items-center lg:justify-evenly ${
				filePresent ? "" : "justify-center items-center"
			}`}
		>
			<div
				className={`${
					filePresent ? "" : "hidden"
				} w-screen h-[10rem] mt-14 lg:w-[60%] lg:h-[80%] lg:mt-0 flex flex-col justify-center`}
			>
				<ReactPlayer
					url={`${
						filePresent && count !== -1
							? `http://${serverIP}:${serverPort}/videos/${count}`
							: ""
					}`}
					height="100%"
					width="100%"
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
				{mediaFilePlaybackError && count !== -1 && (
					<div className="text-center text-red-700 pt-6 font-Poppins">
						Media file is not supported
					</div>
				)}
			</div>

			<div className="flex flex-col justify-center items-center md:scale-110 lg:scale-125">
				<h1
					className={`text-center font-Poppins pb-8 text-2xl font-bold text-white ${
						filePresent ? "hidden" : "block"
					}`}
				>
					Connect Everything
				</h1>
				<form
					className={`${!checkIPandPort ? "block" : "hidden"}`}
					onSubmit={ipAndPortSubmit}
				>
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
							<button className="transition bg-red-400 w-[7em] h-[2.5em] rounded-md hover:bg-red-600 hover:delay-50">
								Submit
							</button>
							<button
								className="transition bg-gray-400 w-[7em] h-[2.5em] rounded-md hover:bg-slate-500 hover:delay-50"
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

				<div className={`${filePresent ? "mt-16" : ""}`}>
					<form
						className={`${checkIPandPort ? "block" : "hidden"}`}
						onSubmit={locationSubmit}
					>
						<div
							className={`font-Poppins text-center flex flex-col justify-center items-center`}
						>
							<input
								id="locationInput"
								className={`max-w-[80%] md:max-w-[90%] h-10 p-3 rounded-md bg-slate-100 outline-gray-300 outline-1 outline-offset-1`}
								type="text"
								value={locationDir}
								placeholder="Enter the absolute path of directory"
								onChange={inputLocationHandler}
							/>
						</div>
						<div className="flex flex-col justify-center items-center">
							<div className="flex justify-evenly w-[20em] mt-4 font-Poppins">
								<button className="transition bg-red-400 w-[7em] h-[2.5em] rounded-md hover:bg-red-600 hover:delay-50">
									Submit
								</button>
								<button
									className={`transition bg-gray-400 w-[7em] h-[2.5em] rounded-md hover:bg-slate-500 hover:delay-50`}
									onClick={resetInput}
									type="button"
								>
									Reset
								</button>
							</div>
							{errorText.length > 0 && (
								<div className="text-red-700 pt-6 font-Poppins">
									{errorText}
								</div>
							)}
						</div>
					</form>
					{filePresent && (
						<div className="mt-4 transition max-w-[22em] max-h-[15em] rounded-md flex justify-center">
							<Button
								id="demo-positioned-button"
								onClick={handleClick}
								variant="contained"
								color="primary"
								size="medium"
							>
								{count === -1
									? "Select a media"
									: videoFile.current[count]}
							</Button>
							<Menu
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
							>
								{videoFile.current.map((file, index) => {
									return (
										<MenuItem
											key={index}
											onClick={(event) =>
												videoChooser(event)
											}
											id={index}
										>
											{file}
										</MenuItem>
									);
								})}
							</Menu>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PlayerLogic;
