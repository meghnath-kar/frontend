import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Welcome to React TypeScript</h1>
        <p className="lead">With Webpack, Bootstrap, and React Router</p>
        
        <div className="row mt-4">
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">React</h5>
                <p className="card-text">
                  A JavaScript library for building user interfaces with components.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">TypeScript</h5>
                <p className="card-text">
                  Add static typing to JavaScript for better development experience.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">React Router</h5>
                <p className="card-text">
                  Client-side routing for building single-page applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
