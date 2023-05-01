import PlayerLogic from "../../components/playerlogic/playerlogic.component";

const Home = () => {
	return (
		<div className="h-screen w-screen fixed flex flex-col justify-center items-center bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100">
			<div className="md:scale-110 lg:scale-125">
				<h1 className="text-center font-Poppins pb-8 text-2xl font-bold text-gray-600">
					Connect Everything
				</h1>
				<PlayerLogic />
			</div>
		</div>
	);
};

export default Home;
