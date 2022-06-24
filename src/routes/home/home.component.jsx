import VideoPlayer from "../../components/reactplayer/reactplayer.component";
import "./home.styles.scss";

const Home = () => {
	return (
		<div className="homescreen">
			<h1 className="main-heading">Connect Everything</h1>
			<VideoPlayer />
			<button onClick={() => alert("works")}>Test</button>
		</div>
	);
};

export default Home;
