import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateUserPage from '@/app/admin/users/create/page';
import { handleCreateUser } from '@/lib/actions/admin/user-action';
import { toast } from 'react-toastify';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock('@/lib/actions/admin/user-action', () => ({
    handleCreateUser: jest.fn(),
}));
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, disabled, type }: any) => (
        <button onClick={onClick} disabled={disabled} type={type}>{children}</button>
    ),
}));

const fullnameInput = () => document.querySelector('input[name="fullname"]') as HTMLElement;
const emailInput = () => document.querySelector('input[name="email"]') as HTMLElement;
const passwordInput = () => document.querySelector('input[name="password"]') as HTMLElement;
const roleSelect = () => document.querySelector('select[name="role"]') as HTMLElement;

describe('Create User Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders key form elements', () => {
        render(<CreateUserPage />);
        expect(screen.getByText('Create User')).toBeInTheDocument();
        expect(fullnameInput()).toBeInTheDocument();
        expect(emailInput()).toBeInTheDocument();
        expect(passwordInput()).toBeInTheDocument();
        expect(roleSelect()).toBeInTheDocument();
    });

    it('defaults to citizen role', () => {
        render(<CreateUserPage />);
        expect(roleSelect()).toHaveValue('citizen');
    });

    it('submit button shows "Create Citizen Account" by default', () => {
        render(<CreateUserPage />);
        expect(screen.getByRole('button', { name: /create citizen account/i })).toBeInTheDocument();
    });

    it('shows authority fields when role is authority', async () => {
        render(<CreateUserPage />);
        fireEvent.change(roleSelect(), { target: { value: 'authority' } });
        await waitFor(() => {
            expect(screen.getByText('Authority Information')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Auto-generated if empty')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('e.g. 9876543210')).toBeInTheDocument();
        });
    });

    it('hides authority fields for citizen role', () => {
        render(<CreateUserPage />);
        expect(screen.queryByText('Authority Information')).not.toBeInTheDocument();
    });

    it('submit button changes label for authority role', async () => {
        render(<CreateUserPage />);
        fireEvent.change(roleSelect(), { target: { value: 'authority' } });
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /create authority account/i })).toBeInTheDocument();
        });
    });

    it('does not call handleCreateUser on empty submit', async () => {
        render(<CreateUserPage />);
        fireEvent.click(screen.getByRole('button', { name: /create citizen account/i }));
        await waitFor(() => expect(handleCreateUser).not.toHaveBeenCalled());
    });

    it('calls handleCreateUser and shows success toast on valid submit', async () => {
        (handleCreateUser as jest.Mock).mockResolvedValue({ success: true });
        render(<CreateUserPage />);

        await userEvent.type(fullnameInput(), 'Jane Doe');
        await userEvent.type(emailInput(), 'jane@example.com');
        await userEvent.type(passwordInput(), 'Password123!');
        fireEvent.click(screen.getByRole('button', { name: /create citizen account/i }));

        await waitFor(() => {
            expect(handleCreateUser).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('User created successfully');
        });
    });

    it('shows error toast on failed create', async () => {
        (handleCreateUser as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Email already in use',
        });
        render(<CreateUserPage />);

        await userEvent.type(fullnameInput(), 'Jane Doe');
        await userEvent.type(emailInput(), 'jane@example.com');
        await userEvent.type(passwordInput(), 'Password123!');
        fireEvent.click(screen.getByRole('button', { name: /create citizen account/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Email already in use');
        });
    });
});