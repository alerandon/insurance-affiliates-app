import './App.css'
import AffiliatesTable from '@/components/affiliates/AffiliatesTable'
import Header from '@/components/Header'
import RegisterForm from '@/components/affiliates/RegisterForm'
import useGetAffiliates from './hooks/useGetAffiliates';
// import LoadingSpinner from './components/LoadingSpinner';
// import ErrorDisplay from './components/ErrorDisplay';

function App() {
const { data } =
    useGetAffiliates();

  // if (loading) {
  //   return <LoadingSpinner message="Cargando afiliados..." />;
  // }

  // if (error) {
  //   return <ErrorDisplay message={error} onRetry={refetch} />;
  // }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-12">
      <Header />
      <RegisterForm />
      <AffiliatesTable affiliates={data.items} />
    </main>
  )
}

export default App
