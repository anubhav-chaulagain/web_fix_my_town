import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';
import { handleLogin } from '@/lib/actions/auth-actions';

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/lib/actions/auth-actions', () => ({ handleLogin: jest.fn() }));

const mockPush = jest.fn();
jest.mock('@/app/context/AuthContext', () => ({
    useAuth: () => ({ checkAuth: jest.fn() }),
}));
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}));

const emailInput = () => document.querySelector('input[name="email"]') as HTMLElement;
const passwordInput = () => document.querySelector('input[name="password"]') as HTMLElement;
const submitBtn = () => screen.getByRole('button', { name: /submit/i });

describe('Login Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders key elements', () => {
        render(<LoginPage />);
        expect(screen.getByText('FixMyTown')).toBeInTheDocument();
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
        expect(emailInput()).toBeInTheDocument();
        expect(passwordInput()).toBeInTheDocument();
        expect(submitBtn()).toBeInTheDocument();
    });

    it('signup link points to /signup', () => {
        render(<LoginPage />);
        expect(screen.getByText('Create a new account').closest('a')).toHaveAttribute('href', '/signup');
    });

    it('does not call handleLogin on empty submit', async () => {
        render(<LoginPage />);
        fireEvent.click(submitBtn());
        await waitFor(() => expect(handleLogin).not.toHaveBeenCalled());
    });

    it('redirects citizen to /user/dashboard', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({ success: true, data: { role: 'citizen' } });
        render(<LoginPage />);
        await userEvent.type(emailInput(), 'john@example.com');
        await userEvent.type(passwordInput(), 'Password123!');
        fireEvent.click(submitBtn());
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/user/dashboard'));
    });

    it('redirects admin to /admin/dashboard', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({ success: true, data: { role: 'admin' } });
        render(<LoginPage />);
        await userEvent.type(emailInput(), 'admin@example.com');
        await userEvent.type(passwordInput(), 'Password123!');
        fireEvent.click(submitBtn());
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/admin/dashboard'));
    });

    it('shows error on failed login', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({ success: false, message: 'Invalid credentials' });
        render(<LoginPage />);
        await userEvent.type(emailInput(), 'john@example.com');
        await userEvent.type(passwordInput(), 'wrongpassword');
        fireEvent.click(submitBtn());
        await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
    });
});