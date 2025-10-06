import AffiliatesTable from '@/components/affiliates/AffiliatesTable'
import RegisterForm from '@/components/affiliates/RegisterForm'
import useGetAffiliates from '@/hooks/useGetAffiliates';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function Main() {
  const { data, loading, error, setPage, refetch } = useGetAffiliates();

  return (
    <main className="w-full flex flex-col items-center">
        <RegisterForm tableRefetch={() => refetch()} />

        {loading && (
          <div className="mt-8 max-w-4xl w-full space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {error && !loading && (
          <Alert variant="destructive" className="mt-8 max-w-4xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!loading && !error && (
          <AffiliatesTable
            affiliates={data.items}
            currentPage={data.page}
            totalItems={data.totalItems}
            limit={data.limit}
            hasNext={data.hasNext}
            hasPrev={data.hasPrev}
            onPageChange={setPage}
          />
        )}
      </main>
  );
}

export default Main;
