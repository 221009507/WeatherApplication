import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main app component', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
