import Statistics from 'components/statistics';

const Home = () => {
  return (
    <div>
      <h2 className="text-center mb-4">You Share, We Lock</h2>
      <section className="mb-32 space-y-8">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ligula eros, tincidunt a ex eget, elementum
          dapibus ante. Maecenas nec elit diam. Nunc ac commodo nisl, quis varius neque. Nunc maximus vitae ipsum eget
          eleifend. Etiam ut blandit diam. Curabitur sed bibendum diam, vitae pulvinar odio. Duis at metus id tortor
          pharetra hendrerit elementum sed mauris.
        </p>
      </section>

      <h2 className="text-center mb-4">Usage Statistics</h2>
      <Statistics />
    </div>
  );
};

export default Home;
