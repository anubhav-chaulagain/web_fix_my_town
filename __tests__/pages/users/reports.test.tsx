import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/user/reports/page';
import { handleGetAllIssues } from '@/lib/actions/issue-actions';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/lib/actions/issue-actions', () => ({
    handleGetAllIssues: jest.fn(),
}));
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    StatusBadge: ({ status }: any) => <span>{status}</span>,
}));

const mockIssues = [
    {
        _id: 'abc12345',
        title: 'Broken Streetlight',
        description: 'Light is out',
        category: 'Broken Streetlight',
        location: 'Main St',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        issueImages: [],
        reportedBy: { _id: 'u1', fullname: 'John', email: 'john@test.com' },
    },
];

describe('My Reports Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('shows loading state initially', () => {
        (handleGetAllIssues as jest.Mock).mockImplementation(
            () => new Promise(() => {}) // never resolves
        );
        render(<Page />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows empty state when no issues', async () => {
        (handleGetAllIssues as jest.Mock).mockResolvedValue({
            success: true,
            data: [],
            pagination: { totalPages: 1, totalItems: 0 },
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByText('No reports found')).toBeInTheDocument();
        });
    });

    it('renders issues in the table', async () => {
        (handleGetAllIssues as jest.Mock).mockResolvedValue({
            success: true,
            data: mockIssues,
            pagination: { totalPages: 1, totalItems: 1 },
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getAllByText('Broken Streetlight')[0]).toBeInTheDocument();
            expect(screen.getByText('Main St')).toBeInTheDocument();
            expect(screen.getByText('pending')).toBeInTheDocument();
        });
    });

    it('renders table headers', async () => {
        (handleGetAllIssues as jest.Mock).mockResolvedValue({
            success: true, data: [], pagination: { totalPages: 1, totalItems: 0 },
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByRole('columnheader', { name: /issue details/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
        });
    });

    it('shows correct issue count', async () => {
        (handleGetAllIssues as jest.Mock).mockResolvedValue({
            success: true,
            data: mockIssues,
            pagination: { totalPages: 1, totalItems: 1 },
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByText('Showing 1 of 1 reports')).toBeInTheDocument();
        });
    });

    it('re-fetches when status filter changes', async () => {
        (handleGetAllIssues as jest.Mock).mockResolvedValue({
            success: true, data: [], pagination: { totalPages: 1, totalItems: 0 },
        });
        render(<Page />);
        await waitFor(() => expect(handleGetAllIssues).toHaveBeenCalledTimes(1));

        fireEvent.change(screen.getByDisplayValue('All Statuses'), {
            target: { value: 'pending' },
        });
        await waitFor(() => expect(handleGetAllIssues).toHaveBeenCalledTimes(2));
    });
});