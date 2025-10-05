import './App.css'
import AffiliatesTable from '@/components/affiliates/AffiliatesTable'
import Header from '@/components/Header'
import RegisterForm from '@/components/affiliates/RegisterForm'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <Header />
      <RegisterForm />
      <AffiliatesTable />
    </main>
  )
}

export default App
