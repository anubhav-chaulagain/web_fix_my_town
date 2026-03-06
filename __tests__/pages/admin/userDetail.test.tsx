import { render, screen, cleanup } from '@testing-library/react';
import Page from '@/app/admin/users/[id]/page';
import { handleGetOneUser } from '@/lib/actions/admin/user-action';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/lib/actions/admin/user-action', () => ({
    handleGetOneUser: jest.fn(),
}));
jest.mock('@/app/user/_components/Shared', () => ({
    Card: ({ children }: any) => <div>{children}</div>,
}));

const mockUser = {
    _id: 'user123',
    fullname: 'John Doe',
    email: 'john@example.com',
    role: 'citizen',
    profilePicture: null,
    department: null,
    employeeId: null,
};

afterEach(() => cleanup());

describe('User Detail Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders user details', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
        expect(screen.getAllByText('john@example.com')[0]).toBeInTheDocument();
    });

    it('edit button links to correct route', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        expect(screen.getByText('Edit User').closest('a'))
            .toHaveAttribute('href', '/admin/users/user123/edit');
    });

    it('throws when user not found', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: false, message: 'Not found' });
        await expect(Page({ params: Promise.resolve({ id: 'user123' }) })).rejects.toThrow('Not found');
    });

    it('does not show department for citizens', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        expect(screen.queryByText('Department')).not.toBeInTheDocument();
    });

    it('shows department for authority users', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({
            success: true,
            data: { ...mockUser, role: 'authority', department: 'Public Works' },
        });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        expect(screen.getByText('Public Works')).toBeInTheDocument();
    });
});