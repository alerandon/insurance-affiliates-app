import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Affiliate } from '@/types/affiliates.type';

interface AffiliatesGridProps {
  affiliates: Affiliate[];
}

function AffiliatesTableDate({ affiliates }: AffiliatesGridProps) {
  return (
    <Table className="mt-8 max-w-4xl mx-auto">
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
            <TableCell>{affiliate.usdAnnualFee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AffiliatesTableDate
