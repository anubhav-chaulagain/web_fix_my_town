import { render, screen } from '@testing-library/react';
import Page from '@/app/user/dashboard/page';

// Mock child dashboards
jest.mock('@/app/user/_components/CitizenDashboard', () => ({
    CitizenDashboard: () => <div>Citizen Dashboard</div>,
}));
jest.mock('@/app/user/_components/AuthorityDashboard', () => ({
    AuthorityDashboard: () => <div>Authority Dashboard</div>,
}));

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('@/app/context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

describe('Dashboard Page', () => {
    it('shows loading skeleton when loading', () => {
        mockUseAuth.mockReturnValue({ user: null, loading: true });
        const { container } = render(<Page />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('shows loading skeleton when user is not yet available', () => {
        mockUseAuth.mockReturnValue({ user: null, loading: false });
        const { container } = render(<Page />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders CitizenDashboard for citizen role', () => {
        mockUseAuth.mockReturnValue({ user: { role: 'citizen' }, loading: false });
        render(<Page />);
        expect(screen.getByText('Citizen Dashboard')).toBeInTheDocument();
    });

    it('renders AuthorityDashboard for authority role', () => {
        mockUseAuth.mockReturnValue({ user: { role: 'authority' }, loading: false });
        render(<Page />);
        expect(screen.getByText('Authority Dashboard')).toBeInTheDocument();
    });
});