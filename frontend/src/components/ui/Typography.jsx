import './css/Typography.css';

export function Title({ children }) {
  return <h1 className="ui-title">{children}</h1>;
}

export function Subtitle({ children }) {
  return <h2 className="ui-subtitle">{children}</h2>;
}
