import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "../_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = params.page as string || '1';
    const size = params.size as string || '10';
    const search = params.search as string || '';

    const response = await handleGetAllUsers(
        page,
        size,
        search as string
    );

    console.log(response)

    if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
    }

    return (
        <div className="p-2 ml-40">
            <Link className="bg-teal-500 border text-white px-5 py-3 rounded-lg inline-block"
                href="/admin/users/create">Create User</Link>
            <UserTable users={response.data} pagination={response.pagination} search={search} />
        </div>
    );
}