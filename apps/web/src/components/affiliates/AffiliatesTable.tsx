import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Affiliate } from 'insurance-affiliates-types';

interface AffiliatesGridProps {
  affiliates: Affiliate[];
  currentPage: number;
  totalItems: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

function AffiliatesTableDate({
  affiliates,
  currentPage,
  totalItems,
  limit,
  hasNext,
  hasPrev,
  onPageChange
}: AffiliatesGridProps) {
  const totalPages = Math.ceil(totalItems / limit);

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con ellipsis
      if (currentPage <= 3) {
        // Mostrar las primeras páginas
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Mostrar las últimas páginas
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mostrar páginas alrededor de la actual
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-2); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-10 lg:mt-12 max-w-4xl w-full">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Annual Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow key={affiliate._id}>
              <TableCell>{affiliate.fullName}</TableCell>
              <TableCell>{affiliate.dni}</TableCell>
              <TableCell>{affiliate.age}</TableCell>
              <TableCell>${affiliate.usdAnnualFee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="mt-10 lg:mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPrev && onPageChange(currentPage - 1)}
                className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => {
              if (pageNum < 0) {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => hasNext && onPageChange(currentPage + 1)}
                className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default AffiliatesTableDate
