import VideoPlayer from "../../components/reactplayer/reactplayer.component";

const Home = () => {
	return (
		<div className="d-flex flex-column">
			<h1 className="mx-auto my-5">Connect Everything</h1>
			<div className="mx-auto my-2">
				<VideoPlayer />
			</div>
		</div>
	);
};

export default Home;
