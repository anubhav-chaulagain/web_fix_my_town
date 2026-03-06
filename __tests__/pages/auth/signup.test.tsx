import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/app/(auth)/signup/page';
import { handleRegister } from '@/lib/actions/auth-actions';

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/lib/actions/auth-actions', () => ({ handleRegister: jest.fn() }));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const fullnameInput = () => document.querySelector('input[name="fullname"]') as HTMLElement;
const emailInput = () => document.querySelector('input[name="email"]') as HTMLElement;
const passwordInput = () => document.querySelector('input[name="password"]') as HTMLElement;
const signupBtn = () => screen.getByRole('button', { name: /signup/i });

const fillAndSubmit = async () => {
    await userEvent.type(fullnameInput(), 'John Doe');
    await userEvent.type(emailInput(), 'john@example.com');
    await userEvent.type(passwordInput(), 'Password123!');
    fireEvent.click(signupBtn());
};

describe('Signup Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders key elements', () => {
        render(<SignupPage />);
        expect(screen.getByText('FixMyTown')).toBeInTheDocument();
        expect(screen.getByText('Create an new account!')).toBeInTheDocument();
        expect(fullnameInput()).toBeInTheDocument();
        expect(emailInput()).toBeInTheDocument();
        expect(passwordInput()).toBeInTheDocument();
        expect(signupBtn()).toBeInTheDocument();
    });

    it('role dropdown only has citizen option', () => {
        render(<SignupPage />);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
        expect(options[0]).toHaveValue('citizen');
    });

    it('login link points to /login', () => {
        render(<SignupPage />);
        expect(screen.getByText('Already have an account?').closest('a')).toHaveAttribute('href', '/login');
    });

    it('does not call handleRegister on empty submit', async () => {
        render(<SignupPage />);
        fireEvent.click(signupBtn());
        await waitFor(() => expect(handleRegister).not.toHaveBeenCalled());
    });

    it('redirects to /login on success', async () => {
        (handleRegister as jest.Mock).mockResolvedValue({ success: true });
        render(<SignupPage />);
        await fillAndSubmit();
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
    });

    it('calls handleRegister with correct data', async () => {
        (handleRegister as jest.Mock).mockResolvedValue({ success: true });
        render(<SignupPage />);
        await fillAndSubmit();
        await waitFor(() =>
            expect(handleRegister).toHaveBeenCalledWith(
                expect.objectContaining({
                    fullname: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123!',
                    role: 'citizen',
                })
            )
        );
    });
});