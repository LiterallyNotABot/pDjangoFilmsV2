import PropTypes from "prop-types";
import Backdrop from "./Backdrop";
import { memo } from "react";

function HeroSection({ user, backdropUrl, onJoin }) {
  return (
    <>
      <Backdrop imageUrl={backdropUrl} />

      <div className="hero-content">
        {user ? (
          <h1 className="hero-title text-white">
            Welcome back, <span className="text-green-500">{user.username}</span>
          </h1>
        ) : (
          <>
            <h1 className="hero-title">
              <span className="green">Shoot a film</span><br />
              or <span className="red">shoot me right in the head</span>.
            </h1>
            <button onClick={onJoin} className="hero-button">
              Join now
            </button>
          </>
        )}
      </div>
    </>
  );
}

HeroSection.propTypes = {
  user: PropTypes.object,
  backdropUrl: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
};

export default memo(HeroSection);
