// This is auto page means that this component will be automatically change it's nature like it parent is server it will be automatically act as server component and if parent is client it will be client component.
import { ExtendUser } from "@/next-auth-extend"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export const UserInfo = ({ user = { ExtendUser }, label = '' }) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        ID
                    </p>
                    <p className="truncate text-s max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        Name
                    </p>
                    <p className="truncate text-s max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="truncate text-s max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        Role
                    </p>
                    <p className="truncate text-s max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        Two Factor Authentication
                    </p>
                    <Badge
                    variant={user?.isTwoFactorEnabled ? "success" : "destructive"  }
                    >
                        {user?.isTwoFactorEnabled ? "Enabled" : "Disabled"}

                    </Badge>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3  shadow-sm ">
                    <p className="text-sm font-medium">
                        Email Verification
                    </p>
                    <p className="truncate text-s max-w-[180px] font-mono bg-slate-100 rounded-md">
                        {user?.emailVerified ? "Email Verified" : "Email Not Verified"  }
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}