import cloud from './cloud.svg';

const Clouds = () => {
  return (
    <div className="-z-10">
      <img src={cloud} className="w-64 absolute top-0 left-0 md:left-4 lg:left-8 xl:left-16" alt="Cloud" />
      <img src={cloud} className="w-48 absolute top-64 right-0 md:right-4 lg:right-8 xl:right-16" alt="Cloud" />
    </div>
  );
};

export default Clouds;
