import CardWrapper from './card-wrapper'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export const ErrorCard = ()=>{
    return(
        // <Card className="w-[400px] shadow-md">
        //     <CardHeader>
        //         <Header label="Oops! Something went wrong." />
        //     </CardHeader>
        //     <CardFooter>
        //         <BackButton
        //         label='Back to Login'
        //         href='/auth/login'
        //         />
        //     </CardFooter>
        // </Card>
        <CardWrapper
        headerLabel = 'Oops! Something went wrong.'
        backButtonLabel='Back to Login Page'
        backButtonHref='/auth/login'
        >
            <div className='w-full flex justify-center items-center '>
            <ExclamationTriangleIcon className='text-destructive'/>
            </div>
        </CardWrapper>
    )
}