import './App.css'
import TableData from '@/components/data/TableData'
import Header from '@/components/Header'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <Header />
      <TableData />
    </main>
  )
}

export default App
