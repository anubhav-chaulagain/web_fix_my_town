import { render, screen, cleanup } from '@testing-library/react';
import Page from '@/app/admin/users/[id]/edit/page';
import { handleGetOneUser } from '@/lib/actions/admin/user-action';

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/lib/actions/admin/user-action', () => ({
    handleGetOneUser: jest.fn(),
}));
jest.mock('@/app/admin/_components/UpdateUserForm', () => ({
    __esModule: true,
    default: ({ user }: any) => <div data-testid="update-form">{user.fullname}</div>,
}));

const mockUser = {
    _id: 'user123',
    fullname: 'John Doe',
    email: 'john@example.com',
    role: 'citizen',
};

afterEach(() => cleanup());

describe('Edit User Page', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders edit form with user data', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        expect(screen.getByText('Edit User')).toBeInTheDocument();
        expect(screen.getByTestId('update-form')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('back link points to user detail page', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
        const jsx = await Page({ params: Promise.resolve({ id: 'user123' }) });
        render(jsx);
        // Query by href directly since the link contains only an SVG
        const backLink = document.querySelector('a[href="/admin/users/user123"]');
        expect(backLink).toBeInTheDocument();
    });

    it('throws when user not found', async () => {
        (handleGetOneUser as jest.Mock).mockResolvedValue({ success: false, message: 'Not found' });
        await expect(Page({ params: Promise.resolve({ id: 'user123' }) })).rejects.toThrow('Not found');
    });
});