import PlayerLogic from "../../components/playerlogic/playerlogic.component";

const Home = () => {
	return (
		<div className="d-flex flex-column">
			<h1 className="mx-auto my-5">Connect Everything</h1>
			<div className="mx-auto my-2">
				<PlayerLogic />
			</div>
		</div>
	);
};

export default Home;
