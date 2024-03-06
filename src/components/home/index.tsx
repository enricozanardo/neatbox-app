import Statistics from 'components/statistics';

const Home = () => {
  return (
    <div>
      <h2 className="text-center mb-4">You Share, We Lock</h2>
      <section className="mb-32 space-y-8 text-center">
        <p>Neatbox - secure cloud storage built on distributed storage system and blockchain technologies.</p>
      </section>

      <h2 className="text-center mb-4">Usage Statistics</h2>
      <Statistics />
    </div>
  );
};

export default Home;
