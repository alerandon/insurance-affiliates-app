import './App.css'
import { Toaster } from 'sonner';
import Header from './components/layout/Header';
import Main from './components/layout/Main';

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <Header />
      <Main />
      <Toaster />
    </div>
  )
}

export default App
