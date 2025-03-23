"use client"
import { admin } from '@/actions/admin';
import { RoleGate } from '@/components/auth/role-gate';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client';
// import { currentRole } from '@/lib/auth';
import React from 'react'
import { toast } from 'sonner';

const AdminPage = () => {
    const onServerActionClick = ()=>{
        admin()
         .then((data)=>{
            if(data.error){
                toast.error(data.error)
            }
            if(data.success){
                toast.success(data.success)
            }
         })
    }

    const onApiRouteClick = ()=>{
        fetch('/api/admin')
          .then((response)=>{
            if(response.ok){
                toast.success('API route accessed successfully');
                // console.log('API route accessed successfully');
            } else{
                toast.error('FORBIDDEN API Route! ');
                // console.error('FORBIDDEN! API route failed');
            }
          })
    }
    // const role = useCurrentRole();
    // const role = currentRole(); // If you are using as server component
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className='text-2xl font-semibold text-center'>
                    🦹‍♂️ Admin Page
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess
                        message='You are allowed to see this content because you are an Admin'
                    />
                </RoleGate>
                <div className='flex flex-row items-center justify-between rounded-lg p-3 shadow-md'>
                    <p className='text-sm font-medium'>
                        Admin-Only API Route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click To Test
                    </Button>
                </div>
                <div className='flex flex-row items-center justify-between rounded-lg p-3 shadow-md'>
                    <p className='text-sm font-medium'>
                        Admin-Only Server Action
                    </p>
                    <Button onClick={onServerActionClick}>
                        Click To Test
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage
