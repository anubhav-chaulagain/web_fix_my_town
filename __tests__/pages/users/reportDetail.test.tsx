import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/user/reports/[id]/page';
import { handleGetIssueById, handleUpdateIssueStatusOnly, handleResolveIssue } from '@/lib/actions/issue-actions';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ back: jest.fn() }),
    useParams: () => ({ id: 'issue123' }),
}));
jest.mock('next/dynamic', () => () => {
    const MapPlaceholder = () => <div>Map</div>;
    MapPlaceholder.displayName = 'MapPlaceholder';
    return MapPlaceholder;
});
jest.mock('@/lib/actions/issue-actions', () => ({
    handleGetIssueById: jest.fn(),
    handleUpdateIssueStatusOnly: jest.fn(),
    handleResolveIssue: jest.fn(),
}));
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children, title }: any) => <div>{title && <h3>{title}</h3>}{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    StatusBadge: ({ status }: any) => <span data-testid="status-badge">{status}</span>,
    Input: (props: any) => <input {...props} />,
}));
jest.mock('@/app/user/_components/ImageCarousel', () => ({
    __esModule: true,
    default: () => <div>Image Carousel</div>,
}));

const mockUseAuth = jest.fn();
jest.mock('@/app/context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

const mockIssue = {
    _id: 'issue123',
    title: 'Pothole on Main St',
    description: 'Deep pothole causing damage',
    category: 'Pothole',
    location: 'Main St',
    status: 'in-progress',
    createdAt: '2024-01-01T00:00:00.000Z',
    reportedBy: { fullname: 'John Doe', email: 'john@test.com' },
    issueImages: [],
    latitude: null,
    longitude: null,
    assignedTo: null,
};

describe('Report Detail Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({ user: { role: 'citizen' } });
    });

    it('shows loading skeleton initially', () => {
        (handleGetIssueById as jest.Mock).mockImplementation(() => new Promise(() => {}));
        const { container } = render(<Page />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('shows error message when issue not found', async () => {
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Issue not found',
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByText('Issue not found')).toBeInTheDocument();
        });
    });

    it('renders issue details correctly', async () => {
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: true,
            data: mockIssue,
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByText('Pothole on Main St')).toBeInTheDocument();
            expect(screen.getByText('Deep pothole causing damage')).toBeInTheDocument();
            expect(screen.getByText('Pothole')).toBeInTheDocument();
        });
    });

    it('does NOT show authority panel for citizens', async () => {
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: true, data: mockIssue,
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.queryByText('Update Work Progress')).not.toBeInTheDocument();
        });
    });

    it('shows authority panel for authority role', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'authority' } });
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: true, data: mockIssue,
        });
        render(<Page />);
        await waitFor(() => {
            expect(screen.getByText('Update Work Progress')).toBeInTheDocument();
        });
    });

    it('calls handleResolveIssue when marking resolved with remarks', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'authority' } });
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: true, data: mockIssue,
        });
        (handleResolveIssue as jest.Mock).mockResolvedValue({ success: true });

        render(<Page />);
        await waitFor(() => screen.getByText('Update Work Progress'));

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'resolved' } });

        fireEvent.change(screen.getByPlaceholderText(/Describe what was done/i), {
            target: { value: 'Fixed the pothole' },
        });

        // ✅ target the button specifically, not the <option>
        fireEvent.click(screen.getByRole('button', { name: 'Mark as Resolved' }));
        await waitFor(() => {
            expect(handleResolveIssue).toHaveBeenCalledWith('issue123', 'Fixed the pothole');
        });
    });

    it('submit button is disabled without remarks when resolving', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'authority' } });
        (handleGetIssueById as jest.Mock).mockResolvedValue({
            success: true, data: mockIssue,
        });
        render(<Page />);
        await waitFor(() => screen.getByText('Update Work Progress'));

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'resolved' } });

        // ✅ same fix here
        const btn = screen.getByRole('button', { name: 'Mark as Resolved' });
        expect(btn).toBeDisabled();
    });
});