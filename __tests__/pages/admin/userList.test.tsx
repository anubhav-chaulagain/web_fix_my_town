import { render, screen, cleanup } from '@testing-library/react';
import Page from '@/app/admin/users/page';
import { handleGetAllUsers } from '@/lib/actions/admin/user-action';

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/lib/actions/admin/user-action', () => ({
    handleGetAllUsers: jest.fn(),
}));
jest.mock('@/app/admin/_components/UserTable', () => ({
    __esModule: true,
    default: ({ users }: any) => (
        <div data-testid="user-table">
            {users.map((u: any) => <div key={u._id}>{u.fullname}</div>)}
        </div>
    ),
}));

afterEach(() => cleanup());

describe('Users List Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders user table with data', async () => {
        (handleGetAllUsers as jest.Mock).mockResolvedValue({
            success: true,
            data: [{ _id: '1', fullname: 'John Doe' }],
            pagination: { totalPages: 1, totalItems: 1 },
        });
        const jsx = await Page({ searchParams: Promise.resolve({}) });
        render(jsx);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    it('create user link points to /admin/users/create', async () => {
        (handleGetAllUsers as jest.Mock).mockResolvedValue({
            success: true, data: [], pagination: {},
        });
        const jsx = await Page({ searchParams: Promise.resolve({}) });
        render(jsx);
        expect(screen.getByText('Create User').closest('a')).toHaveAttribute('href', '/admin/users/create');
    });

    it('throws when response fails', async () => {
        (handleGetAllUsers as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Server error',
        });
        await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrow('Server error');
    });
});