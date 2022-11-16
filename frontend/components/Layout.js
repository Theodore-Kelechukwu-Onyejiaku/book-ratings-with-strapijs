import { Toaster } from 'react-hot-toast';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <Toaster />

      <div className="content">
        {children}
      </div>

    </div>
  );
}
