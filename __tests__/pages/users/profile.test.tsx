import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/user/profile/page';
import { handleUpdateProfile } from '@/lib/actions/auth-actions';
import { toast } from 'react-toastify';

// Mocks
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
jest.mock('@/lib/actions/auth-actions', () => ({
    handleUpdateProfile: jest.fn(),
}));
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>{children}</button>
    ),
}));

const mockCheckAuth = jest.fn();
const mockLogout = jest.fn();
const mockPush = jest.fn();

jest.mock('@/app/context/AuthContext', () => ({
    useAuth: () => ({
        user: {
            fullname: 'John Doe',
            email: 'john@example.com',
            role: 'citizen',
            profilePicture: null,
        },
        logout: mockLogout,
        loading: false,
        checkAuth: mockCheckAuth,
    }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('Profile Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders user info correctly', () => {
        render(<Page />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('shows Your Profile heading', () => {
        render(<Page />);
        expect(screen.getByText('Your Profile')).toBeInTheDocument();
    });

    it('fullname input has correct initial value', () => {
        render(<Page />);
        const input = screen.getByDisplayValue('John Doe');
        expect(input).toBeInTheDocument();
    });

    it('email input is read-only', () => {
        render(<Page />);
        const emailInput = screen.getByDisplayValue('john@example.com');
        expect(emailInput).toHaveAttribute('readonly');
    });

    it('navigates to reset password on Forgot Password click', () => {
        render(<Page />);
        fireEvent.click(screen.getByText('Forgot Password'));
        expect(mockPush).toHaveBeenCalledWith('/request-password-reset');
    });

    it('calls logout when Log out button is clicked', () => {
        render(<Page />);
        fireEvent.click(screen.getByText('Log out from all devices'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('calls handleUpdateProfile on Save Settings', async () => {
        (handleUpdateProfile as jest.Mock).mockResolvedValue({ success: true });
        render(<Page />);
        fireEvent.click(screen.getByText('Save Settings'));
        await waitFor(() => {
            expect(handleUpdateProfile).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    it('shows error toast on failed profile update', async () => {
        (handleUpdateProfile as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Update failed',
        });
        render(<Page />);
        fireEvent.click(screen.getByText('Save Settings'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Update failed');
        });
    });

    it('shows Saving... while update is in progress', async () => {
        (handleUpdateProfile as jest.Mock).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
        );
        render(<Page />);
        fireEvent.click(screen.getByText('Save Settings'));
        expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
});