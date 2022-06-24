import { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
	const [videoFile, setVideoFile] = useState();

	const videoFileHandler = (event) => {
		setVideoFile(URL.createObjectURL(event.target.files[0]));
	};

	return (
		<div>
			<input type="file" onChange={videoFileHandler} />
			<ReactPlayer
				url={videoFile}
				width="100%"
				height="100%"
				controls={true}
			/>
		</div>
	);
};

export default VideoPlayer;
