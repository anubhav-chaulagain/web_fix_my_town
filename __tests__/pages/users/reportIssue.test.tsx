import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '@/app/user/reportIssue/page';
import { handleCreateIssue } from '@/lib/actions/issue-actions';
import { toast } from 'react-toastify';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('@/lib/actions/issue-actions', () => ({
    handleCreateIssue: jest.fn(),
}));
// Avoid SSR issues with dynamic Leaflet map
jest.mock('next/dynamic', () => () => {
    const MapPlaceholder = () => <div>Map Placeholder</div>;
    MapPlaceholder.displayName = 'MapPlaceholder';
    return MapPlaceholder;
});
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, type }: any) => (
        <button onClick={onClick} type={type}>{children}</button>
    ),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('Report Issue Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders all form fields', () => {
        render(<Page />);
        expect(screen.getByText('Report New Issue')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Large pothole blocking lane')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter address or select on map')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Describe the issue in detail...')).toBeInTheDocument();
    });

    it('renders category dropdown with options', () => {
        render(<Page />);
        expect(screen.getByText('Pothole')).toBeInTheDocument();
        expect(screen.getByText('Broken Streetlight')).toBeInTheDocument();
        expect(screen.getByText('Garbage')).toBeInTheDocument();
    });

    it('shows validation errors on empty submit', async () => {
        render(<Page />);
        fireEvent.click(screen.getByText('Report Issue'));
        await waitFor(() => {
            // Zod schema will reject empty fields
            expect(handleCreateIssue).not.toHaveBeenCalled();
        });
    });

    it('submits form and redirects on success', async () => {
        (handleCreateIssue as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Issue reported successfully',
        });
        render(<Page />);

        await userEvent.type(
            screen.getByPlaceholderText('e.g. Large pothole blocking lane'),
            'Broken road on highway'         // ✅ long enough
        );
        await userEvent.type(
            screen.getByPlaceholderText('Enter address or select on map'),
            'Main Street Kathmandu'           // ✅ long enough
        );
        await userEvent.type(
            screen.getByPlaceholderText('Describe the issue in detail...'),
            'There is a large pothole causing accidents'
        );

        fireEvent.click(screen.getByText('Report Issue'));

        await waitFor(() => {
            expect(handleCreateIssue).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/user/dashboard');
        });
    });

    it('shows error toast on failed submission', async () => {
        (handleCreateIssue as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Server error',
        });
        render(<Page />);

        await userEvent.type(
            screen.getByPlaceholderText('e.g. Large pothole blocking lane'),
            'Broken road on highway'         // ✅ long enough to pass Zod
        );
        await userEvent.type(
            screen.getByPlaceholderText('Enter address or select on map'),
            'Main Street Kathmandu'
        );
        await userEvent.type(
            screen.getByPlaceholderText('Describe the issue in detail...'),
            'There is a large pothole causing accidents'
        );

        fireEvent.click(screen.getByText('Report Issue'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Server error');
        });
    });

    it('shows map when map pin button is clicked', () => {
        render(<Page />);
        // MapPin button toggles the map
        const mapButtons = screen.getAllByRole('button');
        const mapToggle = mapButtons.find(btn => btn.querySelector('svg'));
        if (mapToggle) fireEvent.click(mapToggle);
        expect(screen.getByText('Map Placeholder')).toBeInTheDocument();
    });

    it('image upload exceeding 5 shows error', async () => {
        render(<Page />);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const files = Array.from({ length: 6 }, (_, i) =>
            new File(['content'], `image${i}.jpg`, { type: 'image/jpeg' })
        );
        // Simulate adding 3 files first, then 3 more
        fireEvent.change(input, { target: { files: files.slice(0, 3) } });
        fireEvent.change(input, { target: { files: files.slice(3) } });
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('You can only upload up to 5 images');
        });
    });
});