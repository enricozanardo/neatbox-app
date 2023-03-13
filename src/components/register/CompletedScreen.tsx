import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CompletedScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-full mt-4 mb-10 ">
      <div className="text-center">
        <h1 className="text-4xl">Initialization complete! ✔️</h1>
        <div className="mt-4 text-gray-500">
          Redirecting to your <Link to="/dashboard">dashboard</Link> in 3 seconds..
        </div>
      </div>
    </div>
  );
};

export default CompletedScreen;
