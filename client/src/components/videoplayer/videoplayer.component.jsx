import ReactPlayer from "react-player";

const VideoPlayer = ({ id }) => {
	return (
		<ReactPlayer
			className="video-player"
			url={"http://localhost:3001/videos/" + id}
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
	);
};

export default VideoPlayer;
