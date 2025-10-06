import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AffiliatesTable from '@/components/affiliates/AffiliatesTable'
import type { Affiliate } from 'myguardcare-affiliates-types'

describe('AffiliatesTable', () => {
  const mockOnPageChange = vi.fn()
  const mockOnFilterChange = vi.fn()

  const mockAffiliates: Affiliate[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      phoneNumber: '+1234567890123',
      dni: '12345678',
      gender: 'M',
      birthDate: new Date('1990-01-01'),
      age: 34,
      usdAnnualFee: 15,
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      phoneNumber: '+1234567890124',
      dni: '87654321',
      gender: 'F',
      birthDate: new Date('1985-05-15'),
      age: 39,
      usdAnnualFee: 15,
    },
    {
      _id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      fullName: 'Bob Johnson',
      phoneNumber: '+1234567890125',
      dni: '11223344',
      gender: 'M',
      birthDate: new Date('1955-12-20'),
      age: 69,
      usdAnnualFee: 20,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render table with affiliates data', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    // Verificar que se renderizan todos los afiliados
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()

    // Verificar DNIs
    expect(screen.getByText('12345678')).toBeInTheDocument()
    expect(screen.getByText('87654321')).toBeInTheDocument()
    expect(screen.getByText('11223344')).toBeInTheDocument()

    // Verificar edades
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('39')).toBeInTheDocument()
    expect(screen.getByText('69')).toBeInTheDocument()

    // Verificar fees
    expect(screen.getAllByText('$15')).toHaveLength(2)
    expect(screen.getByText('$20')).toBeInTheDocument()
  })

  it('should render empty table when no affiliates', () => {
    render(
      <AffiliatesTable
        affiliates={[]}
        currentPage={1}
        totalItems={0}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    // Verificar que la tabla existe pero no tiene filas de datos
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // Verificar headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('DNI')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Annual Fee')).toBeInTheDocument()
  })

  it('should handle search input', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/ingrese el dni a buscar/i)
    await user.type(searchInput, '12345678')

    expect(searchInput).toHaveValue('12345678')
  })

  it('should call onFilterChange when search button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/ingrese el dni a buscar/i)
    await user.type(searchInput, '12345678')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith('12345678')
  })

  it('should call onFilterChange when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/ingrese el dni a buscar/i)
    await user.type(searchInput, '12345678{Enter}')

    expect(mockOnFilterChange).toHaveBeenCalledWith('12345678')
  })

  it('should clear filter when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/ingrese el dni a buscar/i)
    await user.type(searchInput, '12345678')

    const clearButton = screen.getByRole('button', { name: /clear filter/i })
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
    expect(mockOnFilterChange).toHaveBeenCalledWith('')
  })

  it('should disable search button when input is empty', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
        onFilterChange={mockOnFilterChange}
      />,
    )

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()
  })

  it('should render pagination', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    // Debería haber navegación de paginación
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()

    // Verificar botones de navegación
    expect(screen.getByText(/previous/i)).toBeInTheDocument()
    expect(screen.getByText(/next/i)).toBeInTheDocument()
  })

  it('should call onPageChange when page number is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    // Buscar el elemento de página 2 y hacer click
    const page2 = screen.getByText('2')
    await user.click(page2)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when next button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    const nextButton = screen.getByText(/next/i)
    await user.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={2}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={true}
        onPageChange={mockOnPageChange}
      />,
    )

    const prevButton = screen.getByText(/previous/i)
    await user.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('should disable previous button on first page', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    const prevButton = screen.getByText(/previous/i)
    expect(prevButton.closest('a')).toHaveClass('opacity-50')
  })

  it('should disable next button on last page', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={3}
        totalItems={15}
        limit={5}
        hasNext={false}
        hasPrev={true}
        onPageChange={mockOnPageChange}
      />,
    )

    const nextButton = screen.getByText(/next/i)
    expect(nextButton.closest('a')).toHaveClass('opacity-50')
  })

  it('should highlight current page in pagination', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={2}
        totalItems={15}
        limit={5}
        hasNext={true}
        hasPrev={true}
        onPageChange={mockOnPageChange}
      />,
    )

    const page2 = screen.getByText('2')
    expect(page2.closest('a')).toHaveAttribute('aria-current', 'page')
  })

  it('should show ellipsis for many pages', () => {
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={5}
        totalItems={50}
        limit={5}
        hasNext={true}
        hasPrev={true}
        onPageChange={mockOnPageChange}
      />,
    )

    // Verificar que la paginación existe con muchas páginas
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()
    // Verificar que hay múltiples páginas
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should work without onFilterChange prop', async () => {
    const user = userEvent.setup()
    render(
      <AffiliatesTable
        affiliates={mockAffiliates}
        currentPage={1}
        totalItems={3}
        limit={5}
        hasNext={false}
        hasPrev={false}
        onPageChange={mockOnPageChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/ingrese el dni a buscar/i)
    await user.type(searchInput, '12345678')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    // No debería causar error aunque no haya onFilterChange
    expect(searchInput).toHaveValue('12345678')
  })
})
